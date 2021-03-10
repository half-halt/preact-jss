import { CreateGenerateIdOptions, GenerateId, Jss } from "jss";
import { createContext } from "preact";

export interface JssContext
{
	jss?: Jss;
	disableStyleGeneration?: boolean;
	id?: CreateGenerateIdOptions;
	media?: string;
	generateId?: GenerateId;
	classNamePrefix?: string;
}

export const defaultContextValue: JssContext = {
	classNamePrefix: '',
	disableStyleGeneration: false,
};


export type Theme = {};
export const EmptyTheme: Theme = {};

export const jssContext = createContext<JssContext>(defaultContextValue);
export const themeContext = createContext(EmptyTheme);
