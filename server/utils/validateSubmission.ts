import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const analyticsSubmissionSchema = Joi.object().keys({
	viewId: Joi.string()
		.required()
		.label("View")
		.error((errors: any) => {
			errors.forEach((err: any) => {
				switch (err.type) {
					case "any.empty":
						err.message = "View cannot be empty!";
						break;
					case "any.required":
						err.message = `View is required`;
						break;
					default:
						err.message = "Invalid view";
						break;
				}
			});
			return errors;
		}),
	metricId: Joi.string()
		.pattern(/^ga/)
		.required()
		.label("metric")
		.error((errors: any) => {
			errors.forEach((err: any) => {
				switch (err.type) {
					case "any.empty":
						err.message = "A metric cannot be empty!";
						break;
					case "any.required":
						err.message = `A metric is required`;
						break;
					case "string.regex.base":
						err.message = "Metric must be available in Google Analytics";
						break;
					default:
						err.message = "Invalid metric";
						break;
				}
			});
			return errors;
		}),
	metricName: Joi.string()
		.required()
		.label("metric")
		.error((errors: any) => {
			errors.forEach((err: any) => {
				switch (err.type) {
					case "any.empty":
						err.message = "A metric cannot be empty!";
						break;
					case "any.required":
						err.message = `A metric is required`;
						break;
					default:
						err.message = "Invalid metric";
						break;
				}
			});
			return errors;
		}),
	period: Joi.number()
		.min(1)
		.max(3650)
		.required()
		.error((errors: any) => {
			errors.forEach((err: any) => {
				switch (err.code) {
					case "any.empty":
						err.message = "Period cannot be empty!";
						break;
					case "any.required":
						err.message = "Period is required";
						break;
					case "number.base":
						err.message = "Period must be a number";
						break;
					case "number.max":
						err.message = "Period must be less than 3650 days";
						break;
					case "number.min":
						err.message = "Period must be at least 1 day";
						break;
					default:
						err.message = "Invalid period";
						break;
				}
			});
			return errors;
		}),
	startDate: Joi.date()
		.raw()
		.required()
		.error((errors: any) => {
			errors.forEach((err: any) => {
				switch (err.code) {
					case "any.empty":
						err.message = "Start Date cannot be empty!";
						break;
					case "any.required":
						err.message = "Start Date is required";
						break;
					case "date.base":
						err.message = "Start Date must be a date";
						break;
					case "date.min":
						err.message = "Start Date must be greater than End Date";
						break;
					default:
						err.message = "Invalid date";
						break;
				}
			});
			return errors;
		}),
	endDate: Joi.date()
		.min(Joi.ref("startDate"))
		.max("now")
		.raw()
		.required()
		.error((errors: any) => {
			errors.forEach((err: any) => {
				console.log("type", err.code);
				switch (err.code) {
					case "any.empty":
						err.message = "End Date cannot be empty!";
						break;
					case "any.required":
						err.message = "End Date is required";
						break;
					case "date.base":
						err.message = "End Date must be a date";
						break;
					case "date.min":
						err.message = "End Date must be greater than Start Date";
						break;
					case "date.max":
						err.message = "End Date cannot be in the future";
						break;
					default:
						err.message = "Invalid date";
						break;
				}
			});
			return errors;
		}),
});

const propertiesSchema = Joi.object().keys({
	accountId: Joi.string().required().label("account"),
});

const viewsSchema = Joi.object().keys({
	accountId: Joi.string().required().label("account"),
	propertyId: Joi.string().required().label("property"),
});

const metricsSchema = Joi.object().keys({
	accountId: Joi.string().required().label("account"),
	propertyId: Joi.string().required().label("property"),
	viewId: Joi.string().required().label("view"),
});

const csvSchema = Joi.object().keys({
	period: Joi.number()
		.min(1)
		.max(3650)
		.required()
		.error((errors: any) => {
			errors.forEach((err: any) => {
				switch (err.code) {
					case "any.empty":
						err.message = "Period cannot be empty!";
						break;
					case "any.required":
						err.message = "Period is required";
						break;
					case "number.base":
						err.message = "Period must be a number";
						break;
					case "number.max":
						err.message = "Period must be less than 3650 days";
						break;
					case "number.min":
						err.message = "Period must be at least 1 day";
						break;
					default:
						err.message = "Invalid period";
						break;
				}
			});
			return errors;
		}),
});

const validateRequest = (
	req: Request,
	res: Response,
	next: NextFunction,
	schema: Joi.ObjectSchema
) => {
	const options = {
		abortEarly: false, // include all errors
		allowUnknown: true, // ignore unknown props
		stripUnknown: true, // remove unknown props
	};

	const { error, value } = schema.validate(req.body, options);

	if (error) {
		const errorArr = error.details.map((e) => {
			return {
				field: e.context?.label,
				message: e.message,
			};
		});
		res.send({ errors: errorArr });
	} else {
		req.body = value;
		next();
	}
};

export const validateAnalyticsSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	validateRequest(req, res, next, analyticsSubmissionSchema);
};

export const validatePropertiesSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	validateRequest(req, res, next, propertiesSchema);
};

export const validateViewsSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	validateRequest(req, res, next, viewsSchema);
};

export const validateMetricsSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	validateRequest(req, res, next, metricsSchema);
};

export const validateCsvSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	validateRequest(req, res, next, csvSchema);
};
