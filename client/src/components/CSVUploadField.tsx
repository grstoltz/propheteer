import * as React from "react";
import { useField, useFormikContext } from "formik";
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
} from "@chakra-ui/core";

type CSVUploadFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	name: string;
	value: File;
};

export const CSVUploadField: React.FC<CSVUploadFieldProps> = ({ ...props }) => {
	const [field, { error }] = useField(props);
	const { setFieldValue } = useFormikContext();

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{props.label}</FormLabel>
			<Input
				//{...field}
				type="file"
				// {...props}
				id={field.name}
				onChange={(event: any) => {
					setFieldValue(field.name, event?.currentTarget?.files[0]);
				}}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
