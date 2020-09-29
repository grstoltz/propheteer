import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/core";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";

type DatePickerFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	name: string;
	onChange: ((event: ChangeEvent<HTMLInputElement>) => void) &
		((
			field: string,
			value: any,
			shouldValidate?: boolean | undefined
		) => void);
};

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
	...props
}) => {
	const { setFieldValue } = useFormikContext();
	const [field, { error }] = useField(props);

	const formatDate = (date: Date) => {
		var d = new Date(date),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;

		return [year, month, day].join("-");
	};
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{props.label}</FormLabel>
			<DatePicker
				{...field}
				// {...props}
				dateFormat={"yyyy/MM/dd"}
				selected={(field.value && new Date(field.value)) || null}
				onChange={(val: any) => {
					setFieldValue(field.name, formatDate(val));
				}}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
