import React from "react";
import { Box } from "@chakra-ui/core";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
	variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
	children,
	variant = "regular",
}) => {
	return (
		<Box
			mt={8}
			paddingLeft={2}
			paddingRight={2}
			mx="auto"
			minH="70vh"
			maxW={variant === "regular" ? "1000px" : "400px"}
			w="100%"
		>
			{children}
		</Box>
	);
};
