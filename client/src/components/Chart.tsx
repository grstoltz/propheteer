import * as React from "react";
import { Scatter } from "react-chartjs-2";

interface data {
	ds: string;
	y: string;
}

interface ChartProps {
	forecastData?: data[];
	actualData?: data[];
}

/* Component */
const Chart = (props: ChartProps) => {
	const { actualData, forecastData } = props;

	const forecastDataArr: object[] | undefined = forecastData?.map(
		(row: any) => {
			return {
				x: row.ds,
				y: row.yhat,
			};
		}
	);

	const actualDataArr: object[] | undefined = actualData?.map((row: data) => {
		return {
			x: row.ds,
			y: row.y,
		};
	});

	const defaultLabels = [
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
	];

	const data = {
		labels: forecastData?.length ? [] : defaultLabels,
		datasets: [
			{
				label: "Actual",
				data: actualDataArr,
				fill: false,
				pointRadius: 1,
				backgroundColor: "#171923",
				borderColor: "#171923",
				borderWidth: 1,
			},
			{
				label: "Forecast",
				data: forecastDataArr,
				fill: false,
				pointRadius: 0,
				backgroundColor: "#4FD1C5",
				borderColor: "#4FD1C5",
				borderWidth: 1,
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
		tooltips: {
			callbacks: {
				label: (tooltipItem: any, data: any) => {
					let label = data.datasets[tooltipItem.datasetIndex].label || "";

					if (label) {
						label += ":";
					}
					label = `${label} ${
						Math.round(tooltipItem.yLabel * 100) / 100
					} | ${tooltipItem.xLabel}`;

					return label;
				},
			},
		},
	};
	return <Scatter data={data} options={options} />;
};

export default Chart;
