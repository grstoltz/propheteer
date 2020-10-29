import * as React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/core";
import { useField, FieldProps } from "formik";
import Select from "react-select";

interface PropsType {
	[x: string]: any;
	name: string;
}

// interface Option {
// 	label: string;
// 	value: string;
// }

export const SelectField: React.FC<any & FieldProps> = ({
	form,
	...props
}: PropsType) => {
	// This isn't an input, so instead of using the values in 'field' directly,
	// we'll use 'meta' and 'helpers'.
	//@ts-ignore
	//console.log(props);
	//@ts-ignore

	const { label, options, name, isDisabled, onChange } = props;

	const [field, { error }] = useField(props);

	const formattedOptions = options.map((obj: any) => {
		if (props.id === "metric") {
			return {
				value: obj.id,
				label: obj.uiName,
			};
		}
		return {
			value: obj.id,
			label: obj.name,
		};
	});
	//const { error } = meta;
	// const { setValue } = helpers;

	const getValue = () => {
		if (options) {
			const value = formattedOptions.find(
				(option: any) => option.label === field.value
			);
			if (!value) {
				return {
					value: 0,
					label: `Select ${field.name}...`,
				};
			}
			return value;
		} else {
			return {
				value: 0,
				label: `Select ${field.name}...`,
			};
		}
	};
	//@ts-ignore
	// const { touched, error, value } = meta;
	// //@ts-ignore
	// const { setValue } = helpers;

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Select
				//{...props}
				// {...field}
				value={getValue()}
				isDisabled={isDisabled}
				options={formattedOptions}
				name={field.name}
				onChange={(option: any, action) => {
					console.log(option);
					console.log(action);
					onChange(option);
				}}
				//onChange={onChange}
			/>

			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
