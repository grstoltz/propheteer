import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import About from "./About";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "./theme";
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CSSReset />
		<React.StrictMode>
			<BrowserRouter>
				<Switch>
					<Route exact path="/">
						<App />
					</Route>
					<Route exact path="/about">
						<About />
					</Route>
				</Switch>
			</BrowserRouter>
		</React.StrictMode>
	</ThemeProvider>,
	document.getElementById("root")
);
