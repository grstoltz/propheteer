import * as React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/core";
import { useField, FieldProps } from "formik";
import Select, { ValueType } from "react-select";

interface PropsType {
	[x: string]: any;
	name: string;
}

interface Option {
	label: string;
	value: string;
}

export const SelectField: React.FC<any & FieldProps> = ({
	form,
	...props
}: PropsType) => {
	// This isn't an input, so instead of using the values in 'field' directly,
	// we'll use 'meta' and 'helpers'.

	const { label, options, name, isDisabled } = props;

	const [field, { error }] = useField(name);

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

	const onChange = (option: ValueType<Option | Option[]>) => {
		form.setFieldValue(field.name, (option as Option).value);
	};

	const getValue = () => {
		if (options) {
			return options.find((option: any) => option.value === field.value);
		} else {
			return "" as any;
		}
	};

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
				onChange={onChange}
				instanceId={props.id}
			/>

			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
