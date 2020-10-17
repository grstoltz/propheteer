import * as React from "react";
import {
	Link,
	Box,
	Button,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	Flex,
} from "@chakra-ui/core";
import { CSVLink } from "react-csv";
import { Formik, Form, FormikErrors } from "formik";
import axios from "axios";
import useAsyncEffect from "use-async-effect";
import { Layout } from "./components/Layout";
import Chart from "./components/Chart";

import { CSVForm } from "./components/CSVForm";
import { SelectField } from "./components/SelectField";
import { InputField } from "./components/InputField";
import { DatePickerField } from "./components/DatePickerField";
import { toErrorMap } from "./utils/toErrorMap";

const { useState } = React;

const App = () => {
	const [accounts, setAccounts] = useState([]);
	const [properties, setProperties] = useState([]);
	const [views, setViews] = useState([]);
	const [metrics, setMetrics] = useState([]);

	const [authorized, setAuthorized] = useState(true);

	const [actualData, setActualData] = useState([]);
	const [forecastData, setForecastData] = useState([]);

	useAsyncEffect(async () => {
		try {
			const accountResult = await getAccounts();
			if (!accountResult.data.results) {
				setAuthorized(false);
			} else {
				setAuthorized(true);
				setAccounts(accountResult.data.results);
			}
		} catch (error) {
			console.log(error);
		}
	}, []);

	const getAccounts = () => {
		return axios.get(`/analytics/accounts`, {
			withCredentials: true,
		});
	};

	const getProperties = (accountId: string) => {
		return axios.post(
			`/analytics/properties`,
			{
				accountId,
			},
			{
				withCredentials: true,
			}
		);
	};

	const getViews = (accountId: string, propertyId: string) => {
		console.log("Account", accountId);
		console.log("Property", propertyId);

		return axios.post(
			`/analytics/views`,
			{
				accountId,
				propertyId,
			},
			{
				withCredentials: true,
			}
		);
	};

	const getMetrics = (
		accountId: string,
		propertyId: string,
		viewId: string
	) => {
		return axios.post(
			`/analytics/metrics`,
			{
				accountId,
				propertyId,
				viewId,
			},
			{
				withCredentials: true,
			}
		);
	};

	const handleAccountChange = async (
		e: any,
		setFieldValue: any,
		values: any
	) => {
		const { selectedOptions, value } = e.target;
		const optionId = selectedOptions[0].id;
		if (optionId) {
			setFieldValue("account", value);
			setFieldValue("accountId", optionId);
			const _properties = await getProperties(optionId);
			setProperties(_properties.data.results);
			setFieldValue("property", "");
			setFieldValue("propertyId", 0);

			if (values.accountId) {
				setFieldValue("view", "");
				setFieldValue("viewId", 0);
			}
		}
	};

	const handlePropertyChange = async (
		e: any,
		setFieldValue: any,
		values: any
	) => {
		console.log("values", values);
		const { selectedOptions, value } = e.target;
		const optionId = selectedOptions[0].id;
		if (optionId) {
			setFieldValue("property", value);
			setFieldValue("propertyId", optionId);
			const _views = await getViews(values.accountId, optionId);
			setViews(_views.data.results);
			setFieldValue("view", "");
		}
	};

	const handleViewChange = async (e: any, setFieldValue: any, values: any) => {
		const { selectedOptions, value } = e.target;
		const optionId = selectedOptions[0].id;
		if (optionId) {
			setFieldValue("view", value);
			setFieldValue("viewId", optionId);
			const _metrics = await getMetrics(
				values.accountId,
				values.propertyId,
				optionId
			);
			console.log(_metrics);
			setMetrics(_metrics.data);
			setFieldValue("metric", "");
		}
	};

	const handleMetricChange = (e: any, setFieldValue: any) => {
		const { selectedOptions, value } = e.target;
		const optionId = selectedOptions[0].id;
		if (optionId) {
			setFieldValue("metric", value);
			setFieldValue("metricId", optionId);
		}
	};

	const handleCSVSubmit = async (
		values: { file: File; period: number },
		setErrors: (
			errors: FormikErrors<{
				file: null;
				period: number;
			}>
		) => void
	) => {
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

		if (response.data?.errors) {
			setErrors(toErrorMap(response.data.errors));
		} else if (response.data.forecast.length && response.data.actual.length) {
			setForecastData(response.data.forecast);
			setActualData(response.data.actual);
		}
	};

	const yesterday = ((d) =>
		new Date(d.setDate(d.getDate() - 1)).toISOString().split("T")[0])(
		new Date()
	);

	const oneYear = ((d) =>
		new Date(d.setDate(d.getDate() - 366)).toISOString().split("T")[0])(
		new Date()
	);

	return (
		<>
			<Layout>
				<Tabs variant="enclosed">
					<TabList>
						<Tab>Forecast Using Google Analytics Data</Tab>
						<Tab>Forecast Using a CSV File</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<Formik
								initialValues={{
									account: "None",
									accountId: 0,
									property: "None",
									propertyId: 0,
									view: "None",
									viewId: 0,
									metric: "None",
									metricId: 0,
									startDate: oneYear,
									endDate: yesterday,
									period: 365,
								}}
								onSubmit={async (values, { setErrors }) => {
									const {
										viewId,
										metricId,
										metric,
										period,
										startDate,
										endDate,
									} = values;
									const postObj = {
										viewId,
										startDate,
										endDate,
										metricId,
										metricName: metric,
										period,
									};
									const response = await axios.post(
										`/analytics/data`,
										postObj,
										{
											withCredentials: true,
										}
									);
									console.log(response.data);
									if (response.data?.errors) {
										setErrors(toErrorMap(response.data.errors));
									} else if (
										response.data.forecast.length &&
										response.data.actual.length
									) {
										setForecastData(response.data.forecast);
										setActualData(response.data.actual);
									}
								}}
							>
								{(props) => {
									const {
										values,
										dirty,
										isSubmitting,
										handleChange,
										handleSubmit,
										handleReset,
										setFieldValue,
									} = props;
									return (
										<Form onSubmit={handleSubmit}>
											<Box mt={4}>
												<SelectField
													id="account"
													label="Account"
													name="account"
													value={values.account}
													isDisabled={
														!accounts.length ? true : false
													}
													options={accounts}
													onChange={(event: any) => {
														handleAccountChange(
															event,
															setFieldValue,
															values
														);
													}}
												/>
											</Box>
											<Box mt={4}>
												<SelectField
													id="property"
													label="Property"
													name="property"
													value={values.property}
													isDisabled={
														!properties.length ? true : false
													}
													options={properties}
													onChange={(event: any) => {
														handlePropertyChange(
															event,
															setFieldValue,
															values
														);
													}}
												/>
											</Box>
											<Box mt={4}>
												<SelectField
													id="view"
													label="View"
													name="view"
													value={values.view}
													isDisabled={!views.length ? true : false}
													options={views}
													onChange={(event: any) => {
														handleViewChange(
															event,
															setFieldValue,
															values
														);
													}}
												/>
											</Box>
											<Box mt={4}>
												<SelectField
													id="metric"
													label="Metric"
													name="metrc"
													value={values.metric}
													isDisabled={
														!metrics.length ? true : false
													}
													options={metrics}
													onChange={(event: any) => {
														handleMetricChange(
															event,
															setFieldValue
														);
													}}
												/>
											</Box>
											<Flex mt={4}>
												<Box>
													<DatePickerField
														name="startDate"
														label="Start Date"
														value={values.startDate}
														onChange={() => setFieldValue}
													/>
												</Box>
												<Box ml={5}>
													<DatePickerField
														name="endDate"
														label="End Date"
														value={values.endDate}
														onChange={() => setFieldValue}
													/>
												</Box>
											</Flex>
											<Box mt={4}>
												<InputField
													name="period"
													label="Period"
													value={values.period}
													onChange={handleChange}
												/>
											</Box>

											{/* //////  Buttons /////////*/}
											<Box mt={6}>
												<Button
													type="button"
													className="outline"
													onClick={() => {
														setForecastData([]);
														setActualData([]);

														handleReset();
													}}
													isDisabled={!dirty || isSubmitting}
												>
													Reset
												</Button>
												<Button
													ml={4}
													type="submit"
													isDisabled={
														isSubmitting ||
														values.propertyId === 0 ||
														values.accountId === 0 ||
														values.viewId === 0 ||
														values.metricId === 0
													}
												>
													Submit
												</Button>
												{forecastData.length ? (
													<CSVLink
														data={forecastData}
														filename={`${values.metric}-forecast.csv`}
													>
														<Button
															ml={4}
															type="button"
															className="outline"
															isDisabled={!forecastData.length}
														>
															Download Forecast Data
														</Button>
													</CSVLink>
												) : null}
												{authorized ? null : (
													<Link
														href={
															process.env.NODE_ENV ===
															"production"
																? `/auth/google`
																: "http://localhost:4000/auth/google"
														}
													>
														<Button ml={4} as={Link}>
															Login to Google Analytics
														</Button>
													</Link>
												)}
											</Box>
										</Form>
									);
								}}
							</Formik>
						</TabPanel>
						<TabPanel>
							<CSVForm
								forecastData={forecastData}
								handleSubmit={handleCSVSubmit}
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

export default App;
