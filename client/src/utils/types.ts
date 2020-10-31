export interface FormikActions<Values> {
	setFieldValue<Field extends keyof Values>(
		field: Field,
		value: Values[Field],
		shouldValidate?: boolean
	): void;
}

export interface ServerError {
	message: string;
	field: string;
}

export interface Option {
	label: string;
	value: string;
}
