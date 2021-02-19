import { CreateGenerateIdOptions, GenerateId, Jss, Styles } from "jss";
import { ComponentChildren } from "preact";

//===========================================================================\\

interface Theme 
{
}

interface JssThemeProviderProps
{
	children?: ComponentChildren;
	theme: Theme;
}

/**
 * JSS Theme Provider, provides the theme to JSS engine to contained
 * within this element. Typically there is one of these per application
 * which sets the 'theme' property.
 */
declare function JssThemeProvider(props: JssThemeProviderProps): JSX.Element;

//===========================================================================\\

interface JssProviderProps
{
	jss?: Jss;
	children?: ComponentChildren;
	disableStyleGeneration?: boolean;
	id?: CreateGenerateIdOptions;
	media?: string;
	generateId?: GenerateId;
	classNamePrefix?: string;
}

/**
 * JSS Provider, provides properties to the JSS engine to control the
 * style generation, these can be nested
 * 
 * TODO: inherit the values set from the parent before passing it along.
 */
declare function JssProvider(props: JssProviderProps): JSX.Element;

//===========================================================================\\

type UseStyles = (data?: any) => Record<string, string>;
type ThemedStyles<T> = (theme: T) => Styles;

/**
 * Creates a useStyles() hook based on unthemed styles
 */
declare function createUseStyles(styles: Styles): UseStyles;

/**
 * Creates a useStyles() hook based on themed styles
 */
declare function createUseStyles<T>(styles: ThemedStyles<T>): UseStyles;