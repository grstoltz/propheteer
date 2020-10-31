import * as React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/core";
import { FormikErrors } from "formik";
import axios from "axios";
import SEO from "react-seo-component";
import ReactGA from "react-ga";

import { Layout } from "../components/Layout";
import { Chart } from "../components/Chart";
import { CSVForm } from "../components/CSVForm";
import { GAForm } from "../components/GAForm";

import { toErrorMap } from "../utils/toErrorMap";
import { ServerError } from "../utils/types";

const { useState } = React;

const Forecast = () => {
	const [actualData, setActualData] = useState([]);
	const [forecastData, setForecastData] = useState([]);

	const handleCSVSubmit = async (
		values: { file: File | null; period: number },
		setErrors: (
			errors: FormikErrors<{
				file: null;
				period: number;
			}>
		) => void
	): Promise<void> => {
		if (!values.file) {
			setErrors({ file: "Please include a file." });
			return;
		}
		const sendDate = new Date().getTime();
		const file = values.file;
		const period = values.period.toString();

		let fd = new FormData();
		fd.append("file", file);
		fd.append("period", period);

		const response = await axios.post(`/csv/data`, fd, {
			headers: {
				"content-type": "multipart/form-data",
			},
		});

		const receiveDate = new Date().getTime();

		const responseTime = receiveDate - sendDate;

		ReactGA.event({
			category: "CSV Form",
			action: "Submit",
			label: responseTime.toString(),
		});

		if (response.data?.errors) {
			setErrors(toErrorMap(response.data.errors));
		} else if (response.data.forecast.length && response.data.actual.length) {
			setForecastData(response.data.forecast);
			setActualData(response.data.actual);
		}
	};

	const handleGASubmit = async (values: any, setErrors: any) => {
		const { viewId, metricId, metric, period, startDate, endDate } = values;
		const postObj = {
			viewId,
			startDate,
			endDate,
			metricId,
			metricName: metric,
			period,
		};

		const sendDate = new Date().getTime();

		const response = await axios.post(`/analytics/data`, postObj, {
			withCredentials: true,
		});

		const receiveDate = new Date().getTime();

		const responseTime = receiveDate - sendDate;

		ReactGA.event({
			category: "Google Analytics Form",
			action: "Submit",
			label: responseTime.toString(),
		});

		if (response.data?.errors) {
			const generalError = response.data.errors.find(
				(e: ServerError) => e.field === "general"
			);
			if (generalError) {
				setErrors("general", generalError.message);
			}
			setErrors(toErrorMap(response.data.errors));
		} else if (response.data.forecast.length && response.data.actual.length) {
			setForecastData(response.data.forecast);
			setActualData(response.data.actual);
		}
	};

	const resetData = () => {
		setForecastData([]);
		setActualData([]);
	};

	return (
		<>
			<SEO
				title={"Forecast"}
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

			<Layout>
				<Tabs mt={4} variant="enclosed">
					<TabList>
						<Tab>Forecast Using Google Analytics Data</Tab>
						<Tab>Forecast Using a CSV File</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<GAForm
								forecastData={forecastData}
								handleSubmit={handleGASubmit}
								resetData={resetData}
							/>
						</TabPanel>
						<TabPanel>
							<CSVForm
								forecastData={forecastData}
								handleSubmit={handleCSVSubmit}
								resetData={resetData}
							/>
						</TabPanel>
					</TabPanels>
				</Tabs>
				<Box mt={4}>
					<Chart forecastData={forecastData} actualData={actualData} />
				</Box>
			</Layout>
		</>
	);
};

export default Forecast;
