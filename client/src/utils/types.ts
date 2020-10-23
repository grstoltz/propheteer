export interface FormikActions<Values> {
	setFieldValue<Field extends keyof Values>(
		field: Field,
		value: Values[Field],
		shouldValidate?: boolean
	): void;
}
