import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/core";

interface Option {
	id: string;
	number: string;
	name?: string;
	uiName?: number;
}

type SelectFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	id: string;
	label: string;
	name: string;
	value: string;
	options: Option[];
	isDisabled?: boolean | undefined;
	onChange: ((event: ChangeEvent<HTMLInputElement>) => void) &
		((
			field: string,
			value: any,
			shouldValidate?: boolean | undefined
		) => void);
};

// '' => false
// 'error message stuff' => true

export const SelectField: React.FC<SelectFieldProps> = ({
	id,
	name,
	label,
	value,
	isDisabled,
	options,
	size: _,
	onChange,
	...props
}) => {
	const renderOptionName = (element: Option) => {
		if (name === "metric" || name === "account") {
			return element.name;
		} else {
			return `${element.name || element.uiName} - ${element.id}`;
		}
	};

	return (
		<FormControl
		// isInvalid={!!error}
		>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Select
				id={id}
				name={name}
				as="select"
				value={value}
				isDisabled={isDisabled}
				// @ts-ignore
				onChange={onChange}
			>
				<option value="None">{`Select ${label}`}</option>
				{options.length
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
			{/* //{error ? <FormErrorMessage>{error}</FormErrorMessage> : null} */}
		</FormControl>
	);
};
