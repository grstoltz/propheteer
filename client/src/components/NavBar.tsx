import * as React from "react";
import { Flex, Heading, Box } from "@chakra-ui/core";
import { MenuItems } from "../components/MenuItems";

interface NavBarProps {}

export const NavBar = (props: NavBarProps) => {
	return (
		<Flex
			as="nav"
			align="center"
			justify="space-between"
			wrap="wrap"
			padding="1.5rem"
			bg="gray.900"
			color="teal.300"
			borderBottom="1px solid black"
			{...props}
		>
			<Flex align="center" mr={5}>
				<Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
					<MenuItems to="/">Propheteer</MenuItems>
				</Heading>
			</Flex>

			<Box
				display="flex"
				width="auto"
				alignItems="center"
				flexGrow={1}
				color="teal.300"
			>
				<MenuItems to="/">Home</MenuItems>
				<MenuItems to="/about">About </MenuItems>
			</Box>
		</Flex>
	);
};
