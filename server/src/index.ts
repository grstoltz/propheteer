import * as dotenv from "dotenv";
dotenv.config();

import { __prod__, COOKIE_NAME } from "./constants";

import express from "express";
import axios, { AxiosResponse } from "axios";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import * as bodyParser from "body-parser";
import logger from "morgan";
import multer from "multer";
import cors from "cors";
import { google } from "googleapis";
import papa from "papaparse";
import path from "path";

import {
	validateAnalyticsSubmission,
	validatePropertiesSubmission,
	validateViewsSubmission,
	validateCsvSubmission,
	validateMetricsSubmission,
} from "../utils/validateSubmission";
import { isValidDate } from "../utils/isValidDate";
import { isAuth } from "../utils/isAuth";

const upload = multer({
	fileFilter: (_, file, cb) => {
		if (file.mimetype == "text/csv") {
			cb(null, true);
		} else {
			return cb(null, false);
		}
	},
});

const googleAccounts = google.analytics("v3");
const googleAnalytics = google.analyticsreporting("v4");

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const callbackURL = __prod__
	? "https://propheteer.grantstoltz.com/login/google/return"
	: "http://localhost:4000/login/google/return";
const oauth2Client = new google.auth.OAuth2(
	clientID,
	clientSecret,
	callbackURL
);

const url = oauth2Client.generateAuthUrl({
	access_type: "online",
	scope: "https://www.googleapis.com/auth/analytics.readonly",
});

const RedisStore = connectRedis(session);
const redis = new Redis(process.env.REDIS_URL);

const main = async () => {
	const app = express();

	if (__prod__) {
		app.use(logger("tiny"));
	} else {
		app.use(logger("dev"));
	}

	app.use(express.static(path.join(__dirname, "../../../client/", "build")));

	app.use(
		bodyParser.urlencoded({
			extended: false,
		})
	);
	app.use(bodyParser.json());
	app.set("trust proxy", 1);
	app.use(
		cors({
			origin: process.env.CORS_ORIGIN,
			credentials: true,
			exposedHeaders: ["set-cookie"],
		})
	);
	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: "lax", // csrf
				secure: __prod__, // cookie only works in https
				domain: __prod__ ? ".grantstoltz.com" : undefined,
			},
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET as string,
			resave: false,
		})
	);

	app.post(
		"/analytics/data",
		[isAuth, validateAnalyticsSubmission],
		async (req: any, res: any) => {
			oauth2Client.setCredentials({
				access_token: req.session?.token,
			});

			const { viewId, startDate, endDate, metricId, period } = req.body;

			let repReq = [
				{
					includeEmptyRows: "true",
					viewId,
					dateRanges: [
						{
							startDate,
							endDate,
						},
					],
					metrics: [
						{
							expression: metricId,
						},
					],
					dimensions: [
						{
							name: "ga:date",
						},
					],
				},
			];

			googleAnalytics.reports.batchGet(
				{
					auth: oauth2Client,
					// @ts-ignore
					resource: {
						reportRequests: repReq,
					},
				},
				async (err: any, data: any) => {
					if (err) {
						console.error("Error: " + err);
						res.send("An error occurred");
						return;
					} else if (data) {
						const googleResultsArr = data.data.reports[0].data.rows.map(
							(row: any) => {
								const data = row.dimensions[0].replace(
									/(\d{4})(\d{2})(\d{2})/g,
									"$1-$2-$3"
								);

								return {
									ds: data,
									//[metricName]: row.metrics[0].values[0],
									y: row.metrics[0].values[0],
								};
							}
						);
						const forecastResults = await forecast(
							googleResultsArr,
							period
						);

						console.log(forecastResults);

						if (forecastResults.code) {
							res.send({
								errors: [
									{
										field: "period",
										message:
											"There was an error processing your request",
									},
								],
							});
							return;
						} else {
							res.send({
								forecast: forecastResults,
								actual: googleResultsArr,
							});
						}
					}
				}
			);
		}
	);

	app.get("/auth/google", (_, res) => {
		res.redirect(url);
	});

	app.get("/login/google/return", (req, res) => {
		oauth2Client.getToken(String(req.query.code), (err, tokens) => {
			if (!req.session) {
				throw new Error("No Session");
			}
			if (!err) {
				req.session.token = tokens?.access_token;
				oauth2Client.setCredentials({
					access_token: tokens?.access_token,
				});
				if (__prod__) {
					res.redirect("/");
					return;
				}
				res.redirect("http://localhost:3000");
			} else {
				throw new Error("Error: " + err);
			}
		});
	});

	app.get("/analytics/accounts", isAuth, (req, res) => {
		oauth2Client.setCredentials({
			access_token: req.session?.token,
		});
		googleAccounts.management.accounts.list(
			{
				auth: oauth2Client,
			},
			(err, data: any) => {
				if (err) {
					console.error("Error: " + err);
					res.send("An error occurred");
				} else if (data) {
					let views: any = [];
					data.data.items.forEach((view: any) => {
						views.push({
							name: view.name,
							id: view.id,
						});
					});
					res.send({ type: "views", results: views });
				}
			}
		);
	});

	app.post(
		"/analytics/properties",
		[isAuth, validatePropertiesSubmission],
		(req: any, res: any) => {
			const { accountId } = req.body;
			oauth2Client.setCredentials({
				access_token: req.session?.token,
			});
			googleAccounts.management.webproperties.list(
				{
					auth: oauth2Client,
					accountId: accountId,
				},
				(err: any, data: any) => {
					if (err) {
						console.error("Error: " + err);
						res.send("An error occurred");
					} else if (data) {
						let views: any = [];
						data.data.items.forEach((view: any) => {
							views.push({
								name: view.name,
								id: view.id,
							});
						});
						res.send({ type: "views", results: views });
					}
				}
			);
		}
	);

	app.post(
		"/analytics/views",
		[isAuth, validateViewsSubmission],
		(req: any, res: any) => {
			const { accountId, propertyId: webPropertyId } = req.body;

			oauth2Client.setCredentials({
				access_token: req.session?.token,
			});
			googleAccounts.management.profiles.list(
				{
					auth: oauth2Client,
					accountId,
					webPropertyId,
				},
				(err: any, data: any) => {
					if (err) {
						console.error("Error: " + err);
						res.send("An error occurred");
						return;
					} else if (data) {
						let views: any = [];
						data.data.items.forEach((view: any) => {
							views.push({
								name: view.name,
								id: view.id,
							});
						});
						res.send({ type: "views", results: views });
					}
				}
			);
		}
	);

	app.post(
		"/analytics/metrics",
		[isAuth, validateMetricsSubmission],
		async (req: any, res: any) => {
			const {
				accountId,
				propertyId: webPropertyId,
				viewId: profileId,
			} = req.body;

			const baseMetrics = await axios.get(
				"https://www.googleapis.com/analytics/v3/metadata/ga/columns"
			);

			oauth2Client.setCredentials({
				access_token: req.session?.token,
			});

			const userMetrics = await googleAccounts.management.goals.list({
				auth: oauth2Client,
				accountId,
				webPropertyId,
				profileId,
			});

			const metricArr = baseMetrics.data.items.map((e: any) => {
				if (
					e.attributes.type === "METRIC" &&
					e.attributes.status !== "DEPRECATED" &&
					e.attributes.uiName.toLowerCase().indexOf("goal") === -1
				) {
					const obj = { id: e.id, kind: e.kind, ...e.attributes };
					return obj;
				}
			});

			const combinedArr = metricArr
				.filter(Boolean)
				.concat(userMetrics.data.items);

			res.send(combinedArr);
		}
	);

	app.post(
		"/csv/data",
		[upload.single("file"), validateCsvSubmission],
		async (req: any, res: any) => {
			if (
				!req.file ||
				req.file.fieldname !== "file" ||
				req.file.mimetype !== "text/csv"
			) {
				res.send({
					errors: [
						{
							field: "file",
							message: "File must be a csv",
						},
					],
				});
				return;
			}
			const file = req.file.buffer.toString("utf8");
			const { period } = req.body;

			const { data: csvData }: any = papa.parse(file, {
				header: true,
				skipEmptyLines: true,
			});

			if (!csvData[0].date && !csvData[0].Date) {
				res.send({
					errors: [
						{
							field: "file",
							message: 'File must have a column titled "date"',
						},
					],
				});
				return;
			} else if (!isValidDate(csvData[0].date)) {
				res.send({
					errors: [
						{
							field: "file",
							message: "Date column must be in YYYY-MM-DD format",
						},
					],
				});
				return;
			} else if (Object.keys(csvData[0]).length > 2) {
				res.send({
					errors: [
						{
							field: "file",
							message:
								"Your file must only have two columns of date and a metric",
						},
					],
				});
				return;
			}

			let dimensionPosition = 0;
			let valuePosition = 1;

			if (!isValidDate(Object.values(csvData[0])[0] as string)) {
				dimensionPosition = 1;
				valuePosition = 0;
			}

			const csvArr = csvData.map((row: any) => {
				return {
					ds: Object.values(row)[dimensionPosition],
					y: Object.values(row)[valuePosition],
				};
			});

			try {
				const forecastResults = await forecast(csvArr, period);

				res.send({
					forecast: forecastResults,
					actual: csvArr,
				});
			} catch (e) {
				let message = "There was an error parsing your CSV file";

				if (e.data?.message === "KeyError") {
					message =
						"Please ensure your date is in YYYY-MM-DD format and in the leftmost column";
				}
				res.send({
					errors: [
						{
							field: "file",
							message,
						},
					],
				});
			}
		}
	);

	const forecast = async (data: unknown[], period: string) => {
		try {
			const pythonResponse: AxiosResponse = await axios.post(
				__prod__
					? (process.env.PROPHETEER_API_URL as string)
					: "http://localhost:8080/api/forecast/",
				{
					data,
					period,
				}
			);
			if (!pythonResponse.data) {
				throw new Error("Data not found");
			} else {
				return pythonResponse.data;
			}
		} catch (e) {
			return e;
		}
	};

	if (process.env.NODE_ENV === "production") {
		app.get("*", function (_, res) {
			res.sendFile(
				path.join(__dirname, "../../../client/", "build", "index.html")
			);
		});
	}

	app.listen(4000, () => {
		console.log("Server started at http://localhost:4000");
	});
};

main().catch((err) => {
	console.error(err);
});
