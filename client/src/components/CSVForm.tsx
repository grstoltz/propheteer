import * as React from "react";
import { CSVUploadField } from "./CSVUploadField";
import { CSVLink } from "react-csv";

import { Box, Button, Link, Spinner, Text } from "@chakra-ui/core";
import { Formik, Form } from "formik";

import { InputField } from "./InputField";
interface CSVFormProps {
	handleSubmit: (...args: any) => void;

	forecastData: object[];

	resetData: () => void;
}

export const CSVForm: React.FC<CSVFormProps> = ({ ...props }) => {
	const { handleSubmit, forecastData, resetData } = props;
	return (
		<>
			<Formik
				initialValues={{
					file: null,
					period: 365,
				}}
				onSubmit={(values, { setErrors }) =>
					handleSubmit(values, setErrors)
				}
			>
				{(props) => {
					const {
						values,
						dirty,
						isSubmitting,
						handleChange,
						handleSubmit,
						handleReset,
					} = props;
					return (
						<Form onSubmit={handleSubmit}>
							<Box mt={4}>
								<CSVUploadField
									name="file"
									label="File Upload"
									//@ts-ignore
									value={values.file}
								/>
							</Box>
							<Box mt={2}>
								<Text fontSize="xs">
									Don't have a CSV file handy but want to try this out?
									Download the time series log of daily page views for
									the Wikipedia page for Peyton Manning{" "}
									<Link
										color="teal.500"
										href="https://github.com/facebook/prophet/blob/master/examples/example_wp_log_peyton_manning.csv"
									>
										here.
									</Link>
								</Text>
							</Box>
							<Box mt={4}>
								<InputField
									name="period"
									label="Forecast Period"
									value={values.period}
									onChange={handleChange}
								/>
							</Box>

							<Box mt={6}>
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
									type="submit"
									isDisabled={
										isSubmitting || !values.file || !values.period
									}
								>
									{isSubmitting ? <Spinner /> : "Submit"}
								</Button>
								{forecastData.length ? (
									<CSVLink
										data={forecastData}
										//@ts-ignore
										filename={`${values.file?.name.replace(
											".csv",
											""
										)}-forecast.csv`}
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
							</Box>
						</Form>
					);
				}}
			</Formik>
		</>
	);
};
