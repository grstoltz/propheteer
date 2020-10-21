import * as React from "react";
import { Flex, Box, Link } from "@chakra-ui/core";
import { MenuItems } from "../components/MenuItems";

interface Footer {}

export const Footer = (props: Footer) => {
	return (
		<Flex
			align="center"
			wrap="wrap"
			justify="center"
			padding="2.5 rem"
			marginTop="3.5rem"
			marginBottom="1rem"
			color="teal.300"
			w="100%"
			{...props}
		>
			<Box>
				<MenuItems to="/privacy">Privacy Policy</MenuItems>
			</Box>

			<Box>
				Created by <Link href="https://grantstoltz.com">Grant Stoltz</Link>
			</Box>
		</Flex>
	);
};
