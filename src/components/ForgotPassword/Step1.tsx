"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button, Container, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import CustomFormControl from "../AuthPages/CustomFormControl";

export interface Step1Value {
  email: string;
}

export interface Step1Props {
  increaseStep: (step: number) => void; // eslint-disable-line
  setEmail: (email: string) => void; // eslint-disable-line
}

export const Step1Schema = yup
  .object({
    email: yup.string().required("Email is required."),
  })
  .required();

export const sendEmail = async (data: Step1Value) => {
  const res = await fetch(`/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: data.email }),
  });
  return res;
};

export const Step1: React.FC<Step1Props> = ({ increaseStep, setEmail }) => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Step1Value>({ resolver: yupResolver(Step1Schema) });

  const onSubmit = async (data: Step1Value) => {
    let res: any = await sendEmail(data);

    if (res?.status !== 200) {
      const resBody = await res.json();
      toast({
        title: "Error",
        description: resBody?.message,
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } else {
      increaseStep(1);
      setEmail(data.email);
    }
  };

  return (
    <Stack gap={5}>
      <Heading size="2xl" color="blue.500">
        Forgot Password?
      </Heading>
      <Text size="lg" fontWeight={300}>
        Please enter the email tied with your account.
      </Text>
      <Stack gap={1}>
        <CustomFormControl
          errors={errors}
          name="email"
          label="Email Address"
          placeholder="example@example.com"
          register={register}
        />
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container paddingTop={100}>
          <Button w="100%" type="submit">
            Send Password Reset Email
          </Button>
        </Container>
      </form>
    </Stack>
  );
};
