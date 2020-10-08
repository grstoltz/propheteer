import * as React from "react";
import { Link } from "react-router-dom";
import { Flex, Heading, Box, Text } from "@chakra-ui/core";

interface NavBarProps {}

const MenuItems = (props: any) => {
	const { children, isLast, to = "/", ...rest } = props;
	return (
		<Text
			mb={{ base: isLast ? 0 : 8, sm: 0 }}
			mr={{ base: 0, sm: isLast ? 0 : 8 }}
			display="block"
			{...rest}
		>
			<Link to={to}>{children}</Link>
		</Text>
	);
};

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
					Propheteer
				</Heading>
			</Flex>

			<Box
				display="flex"
				width="auto"
				alignItems="center"
				flexGrow={1}
				color="teal.300"
			>
				{/* <MenuList>
					<MenuItem>
						<Link as={RouterLink} to="/">
							Home
						</Link>
					</MenuItem>
					<MenuItem>
						<Link as={RouterLink} to="/about">
							About
						</Link>
					</MenuItem>
				</MenuList> */}
				<MenuItems to="/">Home</MenuItems>
				<MenuItems to="/about">About </MenuItems>
			</Box>
		</Flex>
	);
};
