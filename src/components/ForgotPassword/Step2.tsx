import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CustomFormControl from "../AuthPages/CustomFormControl";
import React, { useRef } from "react";

export interface Step2Value {
  token: string;
}

export interface Step2Props {
  increaseStep: (step: number) => void; // eslint-disable-line
  setToken: (token: string) => void; // eslint-disable-line
  email: string;
}

// Step 2 schema
export const Step2Schema = yup
  .object({
    token: yup.string().required("Token is required."),
  })
  .required();

export const Step2: React.FC<Step2Props> = ({ increaseStep, setToken, email }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Step2Value>({ resolver: yupResolver(Step2Schema) });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Submit the token
  const onSubmit = async (data: Step2Value) => {
    // Move to the next step
    increaseStep(2);
    setToken(data.token);
  };

  return (
    <>
      <Stack gap={5}>
        <Heading size="2xl" color="blue.500">
          Enter Token
        </Heading>
        <Text size="lg" fontWeight={300}>
          We have sent a token to <strong>{email}.</strong>
        </Text>
        <Text size="lg" fontWeight={300}>
          Check your spam folder if you cannot find it.
        </Text>
        <Stack gap={1}>
          <CustomFormControl
            errors={errors}
            name="token"
            label="Password Reset Token"
            placeholder=""
            register={register}
          />
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ButtonGroup w="100%" top={4}>
            <Button colorScheme="gray" w="100%" onClick={onOpen}>
              Back
            </Button>
            <Button type="submit" w="100%" isLoading={isSubmitting}>
              Next
            </Button>
          </ButtonGroup>
        </form>
      </Stack>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Return to previous step
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You will need to send a new token to reset your password.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => increaseStep(0)} ml={3}>
                Proceed
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
