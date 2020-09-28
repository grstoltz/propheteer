import { ThemeProvider, CSSReset } from "@chakra-ui/core";

import theme from "../theme";

import "react-datepicker/dist/react-datepicker.css";

function MyApp({ Component, pageProps }: any) {
	return (
		<ThemeProvider theme={theme}>
			<CSSReset />
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
