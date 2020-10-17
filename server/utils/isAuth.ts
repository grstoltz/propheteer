import { Response, NextFunction } from "express";

export const isAuth = (req: any, res: Response, next: NextFunction): void => {
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
	} else {
		next();
	}
};
