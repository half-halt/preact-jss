import { FunctionalComponent } from "preact";
import { CreateGenerateIdOptions, GenerateId, Jss } from "jss";
import { jssContext, defaultContextValue }  from "./Context";

interface JssProviderProps
{
	jss?: Jss;
	disableStyleGeneration?: boolean;
	id?: CreateGenerateIdOptions;
	media?: string;
	generateId?: GenerateId;
	classNamePrefix?: string;
}

export const JssProvider: FunctionalComponent<JssProviderProps> = (props) => {
	return (
		<jssContext.Provider value={{...defaultContextValue, ...props}} children={props.children}/>
	);
}
