import { createContext, FunctionalComponent } from "preact";
import { JssProviderProps } from "./index.d";

export interface JssContext extends Omit<JssProviderProps, "children"> {} {}

const defaultContextValue: JssContext = {
	classNamePrefix: '',
	disableStyleGeneration: false,
};

const jssContext = createContext<JssContext>(defaultContextValue);

const JssProvider: FunctionalComponent<JssProviderProps> = (props) => {
	return (
		<jssContext.Provider value={{...defaultContextValue, ...props}} children={props.children}/>
	);
}

export { jssContext, JssProvider };