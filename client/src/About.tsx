import * as React from "react";
import { Text, Link } from "@chakra-ui/core";

import { Layout } from "./components/Layout";

const About = () => {
	return (
		<Layout>
			<Text fontSize="4xl">About</Text>
			<Text fontSize="md">
				Propheteer is an application based on the{" "}
				<Link
					color="teal.500"
					href="http://https://facebook.github.io/prophet/"
				>
					{" "}
					Facebook Prophet
				</Link>{" "}
				tool, allowing you to quickly and easily predict time series data.
				With the Google Analytics integration, you are able to quickly pull
				data from Google Analytics and create forecasts and predictions for
				every metric in the platform. Looking to predict something else than
				Google Analytics data? That's why you'll also see the ability to
				upload a CSV file and get all the same prediction capabilities.
			</Text>
			<Text mt={4} fontSize="4xl">
				Get Started
			</Text>
			<Text fontSize="md">
				<Text fontWeight={"bold"} mt={2} mb={1} fontSize="lg">
					Google Analytics Data
				</Text>
				For Google Analytics data, its simple as authenticating your Google
				Analytics account, selecting your account, property, view, and
				metric you'd like to predict. From there select the date range you'd
				like to use to create your forecast from. The more data you can give
				the tool the better. From there, select how far out you'd like to
				forecast your data for and within a few seconds you'll see your data
				appear. Explore your forecasted data in the chart, or download it as
				a CSV file to use in your own data visualization tool.
				<Text fontWeight={"bold"} mt={4} mb={1} fontSize="lg">
					CSV File
				</Text>
				Getting forecasted data from a CSV file is even easier. Simply
				upload a CSV file with two columns, one with the date in YYYY-MM-DD
				format and the other with the metric you would like predict. In just
				a few seconds your data will ready to go, allowing you to explore
				your data online or download it to a brand new CSV file.
			</Text>
		</Layout>
	);
};

export default About;
