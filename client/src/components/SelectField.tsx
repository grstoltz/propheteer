import * as React from "react";
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Select,
} from "@chakra-ui/core";
import { useField } from "formik";

interface Option {
	id: string;
	number: string;
	name?: string;
	uiName?: number;
}

type SelectFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	id: string;
	label: string;
	name: string;
	// value: string;
	options: Option[];
	isDisabled?: boolean | undefined;
	onChange: ((event: React.ChangeEvent<HTMLSelectElement>) => void) &
		((
			field: string,
			value: string,
			shouldValidate?: boolean | undefined
		) => void);
};

export const SelectField: React.FC<SelectFieldProps> = ({ ...props }) => {
	const { label, options, name, onChange, isDisabled } = props;

	const [field, { error }] = useField(props);

	const renderOptionName = (element: Option) => {
		if (name === "metric" || name === "account") {
			return element.name;
		} else {
			return `${element.name || element.uiName} - ${element.id}`;
		}
	};

	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Select
				{...field}
				isDisabled={isDisabled}
				as="select"
				onChange={onChange}
			>
				<option value="None">{`Select ${label}`}</option>
				{props.options.length
					? options.map((element, index) => {
							return (
								<option
									key={index}
									id={element.id}
									value={element.name || element.uiName}
								>
									{renderOptionName(element)}
								</option>
							);
					  })
					: null}
			</Select>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
