import * as React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/core";
import { FieldProps, useField } from "formik";
import Select from "react-select";

import { Option } from "../utils/types";

interface OptionMap {
	id: string;
	name?: string;
	uiName?: string;
}

export const SelectField: React.FC<any & FieldProps> = ({ ...props }) => {
	const { label, options, name, isDisabled, onChange } = props;

	const [field, { error }] = useField(props);

	const formattedOptions = options.map((obj: OptionMap) => {
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
				onChange={(option: Option, _) => {
					onChange(option);
				}}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
