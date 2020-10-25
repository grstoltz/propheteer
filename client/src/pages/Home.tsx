import {
	Image,
	Box,
	Button,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
} from "@chakra-ui/core";
import * as React from "react";
import SEO from "react-seo-component";

import { Layout } from "../components/Layout";

import image from "../static/pexels-negative-space-97080.jpg";
import prophet from "../static/prophet_logo.png";
import ga from "../static/ga_logo.png";
import csv from "../static/csv_logo.png";

const flexSettings = {
	flex: "1",
	minW: "300x",
	color: "white",
	mx: 6,
	mb: "6",
};

const Home = () => {
	return (
		<>
			<SEO
				title={"Home"}
				titleTemplate={"Propheteer"}
				titleSeparator={`-`}
				description={
					"Propheteer is a tool built on top of Facebook's Prophet predictive modeling software, allowing for quick and  easy way to forecast Google Analytics or time series data."
				}
				pathname={"https://propheteer.grantstoltz.com"}
				siteLanguage={"en"}
				siteLocale={"en_gb"}
				twitterUsername={"@grantstoltz"}
			/>
			<Layout variant="regular">
				<Flex
					align="center"
					justify={{
						base: "center",
						md: "space-around",
						xl: "space-between",
					}}
					direction={{ base: "column-reverse", md: "row" }}
					minH="70vh"
					px={8}
					mb={8}
				>
					<Stack
						spacing={4}
						w={{ base: "80%", md: "40%" }}
						align={["center", "center", "flex-start", "flex-start"]}
					>
						<Heading
							as="h1"
							size="xl"
							fontWeight="bold"
							color="primary.800"
							textAlign={["center", "center", "left", "left"]}
						>
							Propheteer
						</Heading>
						<Heading
							as="h2"
							size="md"
							color="primary.800"
							opacity={0.8}
							fontWeight="normal"
							lineHeight={1.5}
							textAlign={["center", "center", "left", "left"]}
						>
							The easiest way to predict the future...of your data.
						</Heading>
						<Link href="/forecast">
							<Button
								borderRadius="8px"
								py="4"
								px="4"
								lineHeight="1"
								size="md"
								rightIcon="chevron-right"
							>
								Start Forecasting Data
							</Button>
						</Link>
					</Stack>
					<Box
						w={{ base: "80%", sm: "60%", md: "50%" }}
						mb={{ base: 12, md: 0 }}
					>
						<Image src={image} size="100%" rounded="1rem" shadow="2xl" />
					</Box>
				</Flex>
				<Flex w="100%" justify="space-between" flexWrap="wrap">
					<Box {...flexSettings}>
						<Text
							fontSize="xl"
							fontWeight="bold"
							textAlign={"center"}
							color="black"
						>
							Built on Facebook Prophet
						</Text>
						<Flex justify="center">
							<Image mt={4} h="4em" src={prophet} />
						</Flex>

						<Text mt={2} color="black">
							By using Facebook's Prophet model, you're able to recieve
							accurate, reliable, forecast data without the need to learn
							Python.
						</Text>
					</Box>
					<Box {...flexSettings}>
						<Text
							fontSize="xl"
							fontWeight="bold"
							textAlign={"center"}
							color="black"
						>
							Connect to Google Analytics
						</Text>
						<Flex justify="center">
							<Image mt={4} h="4em" alignItems="center" src={ga} />
						</Flex>
						<Text mt={2} color="black">
							You can quickly and securely connect to your Google
							Analytics account and create forecasts from any metric
							available to your to better inform your business decisions.
						</Text>
					</Box>
					<Box {...flexSettings}>
						<Text
							fontSize="xl"
							fontWeight="bold"
							textAlign={"center"}
							color="black"
						>
							Upload Any Time Series Data
						</Text>
						<Flex justify="center">
							<Image mt={4} h="4em" alignItems="center" src={csv} />
						</Flex>
						<Text mt={2} color="black">
							Want to predict something other than Google Analytics data?
							You can upload any data in CSV form and quickly evaluate
							trends and create forecasts.
						</Text>
					</Box>
				</Flex>
			</Layout>
		</>
	);
};

export default Home;
