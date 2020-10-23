import * as React from "react";
import { Flex, Box, Link } from "@chakra-ui/core";
import { MenuItems } from "../components/MenuItems";

interface FooterProps {}

export const Footer = (props: FooterProps) => {
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
				<Link href="https://grantstoltz.com">Created by Grant Stoltz</Link>
			</Box>
		</Flex>
	);
};
