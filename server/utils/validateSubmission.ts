import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const analyticsSubmissionSchema = Joi.object().keys({
	viewId: Joi.string()
		// .regex(\^[0-9]*$\)
		.required(),
	metricId: Joi.string().pattern(/^ga/).required(),
	metricName: Joi.string().required(),
	period: Joi.number()
		.less(700)
		// .pattern(\^[0-9]*$\)
		.required(),
	startDate: Joi.date()
		// set desired date format here
		.raw()
		.required(),
	endDate: Joi.date()
		// set desired date format here
		.raw()
		.required(),
});

const propertiesSchema = Joi.object().keys({
	accountId: Joi.string().required(),
});

const viewsSchema = Joi.object().keys({
	accountId: Joi.string().required(),
	propertyId: Joi.string().required(),
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
		console.log(error.details);
		// next(
		// 	`Validation error: ${error.details.map((x) => x.message).join(", ")}`
		// );
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
) => {
	validateRequest(req, res, next, analyticsSubmissionSchema);
};

export const validatePropertiesSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	validateRequest(req, res, next, propertiesSchema);
};

export const validateViewsSubmission = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	validateRequest(req, res, next, viewsSchema);
};

// export const csvSubmission = (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {};
