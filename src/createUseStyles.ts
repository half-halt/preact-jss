import { useContext, useEffect, useLayoutEffect, useMemo, useRef } from "preact/hooks";
import { jssContext } from "./JssContext";
import { SheetManager } from "./SheetManager";
import { Styles } from "jss";
import { themeContext } from "./JssThemeContext";

export const EmptyTheme = {};
const EmptyData  = {};
var g_sheetId = Number.MIN_SAFE_INTEGER;

export function createUseStyles<ThemeType = {}>(styles: Styles<string> |((theme: ThemeType) => Styles<string>), options = {})
{
	const index = ++g_sheetId;

	return function useStyles(data: any = EmptyData)
	{
		const firstMount = useRef(true);
		const context = useContext(jssContext);
		const theme = useContext(themeContext) || EmptyTheme;
		
		// Create an instance of the stulesheet based on the context/theme
		// the context is unlikely to change, but the theme might.
		const [sheet, dynamicRules] = useMemo(() => {

			const newSheet = SheetManager.CreateSheet({
				theme,
				context,
				styles,
				index,
			});

			const newDynmicRules = newSheet ? SheetManager.AddDynamicRules(newSheet, data) : null;

			if (newSheet) {
				const manager = SheetManager.GetManager(index);
				manager.manage(theme);
			}

			return [newSheet, newDynmicRules];
		}, [context, theme])

		// Whenever our data changes we need to update the dyanmic rules.
		useLayoutEffect(() =>{
			if (sheet && dynamicRules && !firstMount.current) {
				SheetManager.UpdateDynamicRules(sheet!, dynamicRules, data);
			}
		}, [data])

		// Whenever the sheet changes we need to provide  cleanup function
		useLayoutEffect(() => {
			return () => {				
				if (sheet && dynamicRules) {
					SheetManager.RemoveDynamicRules(sheet!, dynamicRules);
				}

				if (theme) {
					const manager = SheetManager.GetManager(index);
					manager.unmanage(theme);
				}
			}
		}, [sheet]);

		// Finally toggle the first mount
		useEffect(() => {
			 firstMount.current = false
		});

		return SheetManager.GetSheetClasses(sheet, dynamicRules);
	}
}
