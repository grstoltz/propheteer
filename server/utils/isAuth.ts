import { Request, Response, NextFunction } from "express";

export const isAuth = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.session?.token) {
		res.send({
			errors: [
				{
					field: "account",
					error: "Not Authenticated",
				},
			],
		});
		return;
	} else if (
		Date.now() > req.session?.expiry_date ||
		!req.session?.expiry_date
	) {
		res.send({
			errors: [
				{
					field: "account",
					error: "Token Expired",
				},
			],
		});
		return;
	} else {
		next();
	}
};
