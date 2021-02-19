import { createContext, FunctionComponent } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { EmptyTheme } from "./createUseStyles";
import { JssThemeProviderProps } from "./index.d";

export const themeContext = createContext(EmptyTheme);
interface Props extends JssThemeProviderProps {}

export const JssThemeProvider: FunctionComponent<Props> = ({
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
		<themeContext.Provider value={themeRef} children={children}/>
	);
}