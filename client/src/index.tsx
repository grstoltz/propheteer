import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import TagManager from "react-gtm-module";

import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import About from "./pages/About";
import Privacy from "./pages/Privacy";

import theme from "./theme";
import "react-datepicker/dist/react-datepicker.css";
import "./static/date-picker.css";

const tagManagerArgs = {
	gtmId: "GTM-W2BVKQ3",
};

TagManager.initialize(tagManagerArgs);

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CSSReset />
		<React.StrictMode>
			<BrowserRouter>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/forecast">
						<Forecast />
					</Route>
					<Route exact path="/about">
						<About />
					</Route>
					<Route exact path="/privacy">
						<Privacy />
					</Route>
				</Switch>
			</BrowserRouter>
		</React.StrictMode>
	</ThemeProvider>,
	document.getElementById("root")
);
