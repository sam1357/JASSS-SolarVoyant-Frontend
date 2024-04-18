import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";

interface CustomFormControlProps {
  errors: any;
  name: string;
  label: string;
  placeholder?: string;
  register: any;
  helperText?: string;
  inputComponent?: React.ComponentType<any>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue?: string;
  inputRightAddon?: string;
}

const CustomFormControlOnChange: React.FC<CustomFormControlProps> = ({
  errors,
  name,
  label,
  placeholder,
  register,
  helperText,
  inputComponent: InputComponent = Input,
  onChange,
  defaultValue,
  inputRightAddon,
}) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        <InputComponent
          placeholder={placeholder}
          defaultValue={defaultValue}
          name={name}
          onChange={onChange}
          {...register(name)}
        />
        {inputRightAddon && <InputRightAddon>{inputRightAddon}</InputRightAddon>}
      </InputGroup>
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

export default CustomFormControlOnChange;
