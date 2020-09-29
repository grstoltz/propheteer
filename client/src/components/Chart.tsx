import React from "react";
import { Scatter } from "react-chartjs-2";

interface actualData {
	ds: string;
	y: string;
}

interface forecastData {
	ds: string;
	trend: string;
}

interface ChartProps {
	forecastData?: object[];
	actualData?: actualData[];
}

/* Component */
const Chart = (props: ChartProps) => {
	const { actualData, forecastData } = props;

	const forecastDataArr: object[] | undefined = forecastData?.map(
		(row: forecastData) => {
			return {
				x: row.ds,
				y: row.trend,
			};
		}
	);

	const actualDataArr: object[] | undefined = actualData?.map(
		(row: actualData) => {
			return {
				x: row.ds,
				y: row.y,
			};
		}
	);

	const data = {
		labels: [
			"2020-01-01",
			"2020-02-01",
			"2020-03-01",
			"2020-04-01",
			"2020-05,01",
			"2020-06-01",
			"2020-07-01",
			"2020-08-01",
			"2020-09-01",
			"2020-10-01",
			"2020-11-01",
			"2020-12-01",
		],
		datasets: [
			{
				label: "Actual",
				data: actualDataArr,
				fill: false,
				pointRadius: 2,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				borderColor: "black",
				borderWidth: 1,
			},
			{
				label: "Forecast",
				data: forecastDataArr,
				fill: false,
				pointRadius: 0,
				backgroundColor: "rgba(54, 162, 235, 0.2)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 2,
				showLine: true,
			},
		],
	};

	const options = {
		scales: {
			xAxes: [
				{
					type: "time",
					time: { parser: "YYYY-MM-DD" },
				},
			],
		},
	};
	return <Scatter data={data} options={options} />;
};

export default Chart;
