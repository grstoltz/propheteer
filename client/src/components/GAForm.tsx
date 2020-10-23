import * as React from "react";
import useAsyncEffect from "use-async-effect";
import axios from "axios";

import { CSVLink } from "react-csv";

import { Link, Box, Button, Flex, Spinner } from "@chakra-ui/core";
import { Formik, Form } from "formik";

import { SelectField } from "../components/SelectField";
import { InputField } from "../components/InputField";
import { DatePickerField } from "../components/DatePickerField";

import { yesterday, oneYear } from "../utils/dateHelper";

const { useState } = React;

interface GAFormProps {
	handleSubmit: (...args: any) => void;

	forecastData: object[];

	resetData: () => void;
}

export const GAForm: React.FC<GAFormProps> = ({ ...props }) => {
	const { handleSubmit, forecastData, resetData } = props;

	const [accounts, setAccounts] = useState([]);
	const [properties, setProperties] = useState([]);
	const [views, setViews] = useState([]);
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

	const handleAccountChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
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
		e: React.ChangeEvent<HTMLSelectElement>,
		setFieldValue: any,
		values: any
	) => {
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

	const handleViewChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
		setFieldValue: any,
		values: any
	) => {
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

	const handleMetricChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
		setFieldValue: any
	) => {
		const { selectedOptions, value } = e.target;
		const optionId = selectedOptions[0].id;
		if (optionId) {
			setFieldValue("metric", value);
			setFieldValue("metricId", optionId);
		}
	};

	return (
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
			onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
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
								onChange={(event: any) => {
									handleAccountChange(event, setFieldValue, values);
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
								onChange={(event: any) => {
									handlePropertyChange(event, setFieldValue, values);
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
									handleViewChange(event, setFieldValue, values);
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
								onChange={(event: any) => {
									handleMetricChange(event, setFieldValue);
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
							{authorized ? null : (
								<Link
									href={
										process.env.NODE_ENV === "production"
											? `/auth/google`
											: "http://localhost:4000/auth/google"
									}
								>
									<Button ml={4}>Login to Google Analytics</Button>
								</Link>
							)}
						</Flex>
					</Form>
				);
			}}
		</Formik>
	);
};
