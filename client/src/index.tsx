import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "./theme";
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CSSReset />
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ThemeProvider>,
	document.getElementById("root")
);
