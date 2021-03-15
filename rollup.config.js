import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import peers from "rollup-plugin-peer-deps-external";
import strip from "@rollup/plugin-strip";
import env from "rollup-plugin-inject-process-env";
import { terser } from "rollup-plugin-terser";

const commonConfig = {
	input: "src/index.ts",
	output: [
		{
			file: "dist/preact-jss-tiny.esm.js",
			format: "es",
			sourcemap: true,
		},
		{
			file: "dist/preact-jss-tiny.js",
			format: "cjs",
			sourcemap: true,
		}
	],
	external:[
		"jss",
		"jss-preset-default",
		"preact"
	]
}

const devConfig = {
	plugins:[
		typescript(),
		peers(),
		resolve({
			moduleDirectory: "node_modules",
		}),
		env({
			NODE_ENV: "development"
		})
	],
}

const config = {
	plugins:[
		typescript(),
		peers(),
		resolve(),
		env({
			NODE_ENV: "production"
		}),
		strip({
			include: "**/*.(js|jsx|ts|tsx)",
			functions: [ "log.info", "console.log" ],
		}),		
		terser(),
	],
}

export default (commandLine) => {
	if (commandLine.configDebug) {
	return Object.assign(commonConfig, devConfig);
	}
	return Object.assign(commonConfig, config);
}
