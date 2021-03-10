import { FunctionComponent } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { themeContext, Theme, EmptyTheme } from "./Context";

interface JssThemeProviderProps
{
	theme: any;
}

export const JssThemeProvider: FunctionComponent<JssThemeProviderProps> = ({
	theme,
	children
}) => {
	const [themeRef, setThemeRef] = useState(theme || EmptyTheme);

	useLayoutEffect(() => {
		if (theme !== themeRef) {
			setThemeRef(theme || EmptyTheme);
		}
	}, [theme])

	return (
		<themeContext.Provider value={themeRef as Theme} children={children}/>
	);
}