import * as React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/core";
import { useField, FieldProps } from "formik";
import Select from "react-select";

interface PropsType {
	[x: string]: any;
	name: string;
}

interface Option {
	label: string;
	value: string;
}

export const SelectField: React.FC<any & FieldProps> = ({
	...props
}: PropsType) => {
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

	const getValue = () => {
		if (options) {
			const value = formattedOptions.find(
				(option: Option) => option.label === field.value
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

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Select
				value={getValue()}
				isDisabled={isDisabled}
				options={formattedOptions}
				name={field.name}
				onChange={(option: any, action) => {
					onChange(option);
				}}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
