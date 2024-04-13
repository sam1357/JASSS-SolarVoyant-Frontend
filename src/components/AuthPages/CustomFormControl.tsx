import React from "react";
import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText } from "@chakra-ui/react";

interface CustomFormControlProps {
  errors: any;
  name: string;
  label: string;
  placeholder?: string;
  register: any;
  helperText?: string;
  inputComponent?: React.ComponentType<any>;
}

const CustomFormControl: React.FC<CustomFormControlProps> = ({
  errors,
  name,
  label,
  placeholder,
  register,
  helperText,
  inputComponent: InputComponent = Input,
}) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel>{label}</FormLabel>
      <InputComponent placeholder={placeholder} {...register(name)} />
      {!!!errors[name] ? (
        <FormHelperText>
          {(helperText && helperText.length !== 0 && helperText) || " "}
        </FormHelperText>
      ) : (
        <FormErrorMessage>{(errors[name] && errors[name].message) || " "}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default CustomFormControl;
