import { SheetsManager, create, Styles, StyleSheet, getDynamicStyles, JssStyle } from "jss";
import { EmptyTheme } from "./Context";
// @ts-ignore
import preset from "jss-preset-default";

export type DynmaicRules = Record<string, string>;

interface SheetMetadata 
{
	dynamicStyles: Styles<string>|null;
	styles: Styles<string>;
}

export const defaultJss = create(preset());

function getStylesFromOptions(options: any)
{
	const styles = options.styles;
	
	switch (typeof(styles))
	{
		case "function":
			return styles(options.theme);
		
		case "object":
			return styles;
	}

	throw new Error(`Unknown styles object type ${typeof(styles)}`);
}

export class SheetManager
{
	private static s_metadata = new Map<StyleSheet, SheetMetadata>();
	private static s_managers = new Map<number, SheetsManager>();

	static GetManager(index: number)
	{
		let manager = SheetManager.s_managers.get(index);
		if (!manager) {
			manager = new SheetsManager();
			SheetManager.s_managers.set(index, manager);
		}
		return manager;
	}

	static CreateSheet(options: any): StyleSheet
	{
		const { theme, generateId, sheetOptions, context, index } = options;

		const manager = SheetManager.GetManager(index);
		const existing = manager.get(theme);
		if (existing) {
			return existing;
		}

		const styles = getStylesFromOptions(options);
		const dynamicStyles = getDynamicStyles(styles);
		const jss = (options.context ? options.context.jss : null) || defaultJss;

		let minify = false;
		if (context.id && context.id.minify) {
			minify = context.id.minify;
		}

		const sheet = jss.createStyleSheet(styles, {
			...sheetOptions,
			index,
			meta: theme !== EmptyTheme ? "(Themed)" : "",
			classNamePrefix: context.classNamePrefix,
			link: (dynamicStyles !== null),
			generateId: generateId || context.generateId,
			minify
		});

		SheetManager.s_metadata.set(sheet, { dynamicStyles, styles });
		manager.add(options.theme, sheet);

		return sheet;
	}

	static AddDynamicRules(sheet: StyleSheet, data: any)
	{
		const rules:  DynmaicRules = {};

		if (sheet) {
			const metadata = SheetManager.s_metadata.get(sheet);
			const dynamicStyles = metadata ? metadata.dynamicStyles : null;

			if (dynamicStyles) {
				for (const key in dynamicStyles) {
					//@ts-ignore
					const count = sheet.rules.index.length;
					const originalRule = sheet.addRule(key, dynamicStyles[key] as JssStyle);

					//@ts-ignore
					for (var i = count; i < sheet.rules.index.length; ++i) {
						//@ts-ignore
						const rule = sheet.rules.index[i];
						// @ts-ignore
						sheet.updateOne(rule, data);
						rules[originalRule === rule ? key : rule.key] = rule;
					}
				}
			}

		}
		return rules;
	}

	static UpdateDynamicRules(sheet: StyleSheet, dynamicRules: DynmaicRules, data: any)
	{
		if (sheet) {
			for (const key in dynamicRules) {
				//@ts-ignore
				sheet.updateOne(dynamicRules[key], data);
			}
		}
	}

	static RemoveDynamicRules(sheet: StyleSheet, dynamicRules: DynmaicRules)
	{
		if (sheet) {
			for (const key in dynamicRules) {
				sheet.deleteRule(dynamicRules[key]);
			}
		}
	}

	static GetSheetClasses(sheet: StyleSheet, dynamicRules: DynmaicRules|null|undefined)
	{
		const metadata = sheet ? SheetManager.s_metadata.get(sheet) : null;
		if (!metadata || !dynamicRules) {
			return sheet.classes;
		} 
		const classes: Record<string, string> = {};
	
		for (const key in metadata.styles) {
			classes[key] = sheet.classes[key];

			if (key in dynamicRules) {
				//@ts-ignore
				classes[key] += ` ${sheet.classes[dynamicRules[key].key]}`;
			}
		}

		return classes;
	}
}