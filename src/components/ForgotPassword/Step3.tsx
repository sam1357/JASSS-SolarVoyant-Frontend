import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button, Container, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import CustomFormControl from "../AuthPages/CustomFormControl";
import { PasswordInput } from "@saas-ui/react";

export interface Step3Value {
  password: string;
}

export interface Step3Props {
  token: string;
  email: string;
}

export const resetPassword = async (token: string, email: string, data: Step3Value) => {
  const res = await fetch(`/api/auth/forgot-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, token: token, newPassword: data.password }),
  });
  return res;
};

export const Step3Schema = yup
  .object({
    password: yup.string().required("A valid password is required."),
  })
  .required();

export const Step3: React.FC<Step3Props> = ({ token, email }) => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Step3Value>({ resolver: yupResolver(Step3Schema) });

  const onSubmit = async (data: Step3Value) => {
    let res: any = await resetPassword(token, email, data);
    const resBody = await res.json();
    if (res?.status !== 200) {
      toast({
        title: "Error",
        description: resBody?.message,
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Success",
        description: resBody?.message,
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack gap={5}>
      <Heading size="2xl" color="blue.500">
        Enter Password
      </Heading>
      <Text size="lg" fontWeight={300}>
        Please enter your new password
      </Text>
      <Stack gap={1}>
        <CustomFormControl
          errors={errors}
          name="password"
          label="New Password"
          placeholder=""
          register={register}
          inputComponent={PasswordInput}
        />
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container paddingTop={100}>
          <Button w="100%" type="submit">
            Reset Password
          </Button>
        </Container>
      </form>
    </Stack>
  );
};
