# preact-jss-tiny

This is a small library which provides support for using JSS in preact. Via the "createUseStyles" function which behaves 
exactly like the version from 'react-jss'.  This has the same refcount/dependecy management of the style sheet, so each 
instance of the component shares the same copy of the style sheet. In addition it supports dynamic (props) based style
properries and also themeing (optional). This is written in typescript and provides full typing as part of the package.

# createUseStyles
tbd

# JssProvider
Provides properties which affect the behavior of JSS to the children.

	const Root: FunctionalComponent = () => {
		return (
			<JssProvider classNamePrefix="myapp-">
				<Applicaton />
			</JssPrvider>
		);
	}

### Supported Properties
All of the following properties are optional on the provider, if you just want default behavior the provider c
can actually be omitted entierly.

- **jss**: Provide you own implementation of JSS, by default this created from "jss-preset-default"
- **disableStyleGeneration**: disable all style generation on the tree.
- **id**: tbd
- **generateId**: tbd
- **classNamePrefix**: Specify a prefix to be applied to the generated styles.

# JssThemeProvider
A theme provider is used to provide a theme which can be used for style generation.

	const myTheme = {
		background: "cornsilk",
		color: "magenta"
	};

	const Root: FunctionalComponent = () => {
		return (
			<JssThemeProvider theme={myTheme}>
				<Application /
			</JssThemeProvider>
		);
	}

### Supported Properties
- **theme**: Specify the theme to apply to the tree below, changing the them will result in a redraw and regeneration of the content below.  The contents and format of the theme object is left to the consumer of library.

# Complete Example

	import { createUseStyles, JssProvider, JssThemeProvider} from "preact-jss-tiny";
	import { render, FunctionalComponent } from "preact";

	const myTheme = {
		background: "cornsilk",
		color: "magenta",
	};

	const useStyles = createUseStyles((theme: typeof myTheme) => ({
		"@global body": {
			backgroundColor: theme.background
		},

		root: {
			color: theme.color
		},

		header: {
			color: "rgba(0,0,0,0.80)"
		}
	}));

	const Application: FunctionalComponent = () => {
		const styles = useStyles();

		return (
			<div className={styles.root}>
				<h1 className={styles.header}>Header</h1>
				This is magenta text
			</div>
		);
	}

	const Root: FunctionalComponent = () => {
		return (
			<JssProvider classNamePrefix="myapp-">
				<JssThemeProvider theme={myTheme}>
					<Application />
				</JssThemeProvider>
			</JssProvider>
		);
	}

	render(<Root/>, document.body);

# Dependencies (peer)
	* jss: "^10.5.1"
	* jss-preset-default: "^10.5.1"
    * preact: "^10.5.12"