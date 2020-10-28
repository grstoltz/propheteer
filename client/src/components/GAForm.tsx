import * as React from "react";
import useAsyncEffect from "use-async-effect";
import axios from "axios";

import { CSVLink } from "react-csv";

import { Link, Box, Button, Flex, Spinner, Image, Text } from "@chakra-ui/core";
import { Formik, Form } from "formik";

import { SelectField } from "../components/SelectFieldv2";
import { InputField } from "../components/InputField";
import { DatePickerField } from "../components/DatePickerField";

import { yesterday, oneYear } from "../utils/dateHelper";

import googleButton from "../static/btn_google_signin_dark_normal_web@2x.png";

const { useState } = React;

interface GAFormProps {
	handleSubmit: (...args: any) => void;

	forecastData: object[];

	resetData: () => void;
}

export const GAForm: React.FC<GAFormProps> = ({ ...props }) => {
	const { handleSubmit, forecastData, resetData } = props;

	const [accounts, setAccounts] = useState([]);
	// @ts-ignore
	const [properties, setProperties] = useState([]);
	// @ts-ignore
	const [views, setViews] = useState([]);
	// @ts-ignore
	const [metrics, setMetrics] = useState([]);

	const [authorized, setAuthorized] = useState(true);

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
			setAuthorized(false);
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
	// @ts-ignore
	const handleAccountChange = async (
		option: any,
		setFieldValue: any,
		values: any
	) => {
		const { label, value } = option;
		if (value) {
			setFieldValue("account", label);
			setFieldValue("accountId", value);
			const _properties = await getProperties(value);

			setProperties(_properties.data.results);
			setFieldValue("property", "");
			setFieldValue("propertyId", 0);

			if (values.accountId) {
				setFieldValue("view", "");
				setFieldValue("viewId", 0);
			}
		}
	};
	// @ts-ignore
	const handlePropertyChange = async (
		option: any,
		setFieldValue: any,
		values: any
	) => {
		const { label, value } = option;
		if (value) {
			setFieldValue("property", label);
			setFieldValue("propertyId", value);
			const _views = await getViews(values.accountId, value);
			setViews(_views.data.results);
			setFieldValue("view", "");
		}
	};
	// @ts-ignore
	const handleViewChange = async (
		option: any,
		setFieldValue: any,
		values: any
	) => {
		const { label, value } = option;
		if (value) {
			setFieldValue("view", label);
			setFieldValue("viewId", value);
			const _metrics = await getMetrics(
				values.accountId,
				values.propertyId,
				value
			);
			setMetrics(_metrics.data);
			setFieldValue("metric", "");
		}
	};
	// @ts-ignore
	const handleMetricChange = (option: any, setFieldValue: any) => {
		const { label, value } = option;
		if (value) {
			setFieldValue("metric", label);
			setFieldValue("metricId", value);
		}
	};

	return (
		<>
			{authorized ? null : (
				<>
					<Box
						paddingBottom={4}
						borderBottomColor="#171923"
						borderBottom="1px"
					>
						<Box mt={4}>
							<Text fontWeight="bolder">
								Sign in with Google Analytics to get started.
							</Text>
						</Box>
						<Box mt={2}>
							<Link
								href={
									process.env.NODE_ENV === "production"
										? `/auth/google`
										: "http://localhost:4000/auth/google"
								}
							>
								<Image h="2.5rem" src={googleButton} />
							</Link>
						</Box>
					</Box>
				</>
			)}

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
				onSubmit={(values, { setErrors }) =>
					handleSubmit(values, setErrors)
				}
				enableReinitialize={true}
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
									isDisabled={!accounts.length ? true : false}
									options={accounts}
									onChange={async (option: any) => {
										//handleChange("account")(option.label);
										handleAccountChange(
											option,
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
									isDisabled={!properties.length ? true : false}
									options={properties}
									onChange={(option: any) => {
										handlePropertyChange(
											option,
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
									onChange={(option: any) => {
										handleViewChange(option, setFieldValue, values);
									}}
								/>
							</Box>
							<Box mt={4}>
								<SelectField
									id="metric"
									label="Metric"
									name="metrc"
									value={values.metric}
									isDisabled={!metrics.length ? true : false}
									options={metrics}
									onChange={(option: any) => {
										handleMetricChange(option, setFieldValue);
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
									label="Forecast Period"
									value={values.period}
									onChange={handleChange}
								/>
							</Box>
							<Flex mt={6}>
								<Button
									type="button"
									className="outline"
									onClick={() => {
										setFieldValue("account", "");
										handleReset();
										resetData();
									}}
									isDisabled={!dirty || isSubmitting}
								>
									Reset
								</Button>
								<Button
									ml={4}
									minWidth={"2.5rem"}
									type="submit"
									isDisabled={
										isSubmitting ||
										values.propertyId === 0 ||
										values.accountId === 0 ||
										values.viewId === 0 ||
										values.metricId === 0
									}
								>
									{isSubmitting ? <Spinner /> : "Submit"}
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
							</Flex>
						</Form>
					);
				}}
			</Formik>
		</>
	);
};
