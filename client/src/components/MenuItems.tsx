import * as React from "react";
import { Link } from "react-router-dom";
import { Text } from "@chakra-ui/core";

interface MenuItemsProps {
	children: React.ReactNode;
	isLast?: boolean;
	to: string;
}

export const MenuItems = (props: MenuItemsProps) => {
	const { children, isLast, to = "/" } = props;
	return (
		<Text
			mb={{ base: isLast ? 0 : 8, sm: 0 }}
			mr={{ base: 0, sm: isLast ? 0 : 8 }}
			display="block"
		>
			<Link to={to}>{children}</Link>
		</Text>
	);
};
