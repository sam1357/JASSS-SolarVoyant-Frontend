"use client";

import {
  Grid,
  GridItem,
  Heading,
  Text,
  Container,
  Stack,
  Button,
  Link,
  Center,
  Hide,
  useToast,
} from "@chakra-ui/react";
import { PasswordInput, useForm } from "@saas-ui/react";
import DividerWithText from "@components/DividerWithText";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Api } from "@utils/Api";
import CustomFormControl from "@components/AuthPages/CustomFormControl";
import { signIn } from "next-auth/react";

interface RegisterSubmitValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema = yup
  .object({
    username: yup
      .string()
      .required("Username is required.")
      .matches(/^[\w]+$/, "Username can only contain alphanumeric characters"),
    email: yup.string().required("Email is required.").email("Please provide a valid email."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password must contain at least 6 characters."),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match.")
      .required("Please re-type your password."),
  })
  .required();

export default function SignupPageClient() {
  const toast = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSubmitValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: RegisterSubmitValues) => {
    await Api.register(data.username, data.email, data.password).then(async (res) => {
      if (res?.status !== 200) {
        toast({
          title: "Error",
          description: (await res.json()).error,
          status: "error",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
      } else {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then((res) => {
          if (res?.status !== 200) {
            toast({
              title: "Error",
              description: res?.error,
              status: "error",
              position: "top",
              duration: 4000,
              isClosable: true,
            });
          } else {
            router.push("/setup");
          }
        });
      }
    });
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" minHeight={"100%"}>
      <Hide below="md">
        <GridItem w="100%" position="relative" bgGradient="linear(to-r, #FAD262, #FFECBA)">
          <Image src="/signup.svg" alt="Solar panels" fill style={{ objectFit: "cover" }} />
        </GridItem>
      </Hide>
      <GridItem alignItems="center" display="flex" colSpan={{ base: 3, sm: 3, md: 2 }}>
        <Container>
          <Stack gap={5}>
            <Heading size="2xl" color="blue.500">
              Welcome Aboard!
            </Heading>
            <Text size="lg" fontWeight={300}>
              Enter your details below.
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={2}>
                <CustomFormControl
                  errors={errors}
                  name="username"
                  label="Username"
                  placeholder="jamessmith"
                  helperText="Alphanumeric characters only."
                  register={register}
                />
                <CustomFormControl
                  errors={errors}
                  name="email"
                  label="Email address"
                  placeholder="example@example.com"
                  helperText="You will use your email to sign in."
                  register={register}
                />
                <CustomFormControl
                  errors={errors}
                  name="password"
                  label="Password"
                  register={register}
                  helperText="Must be at least 6 characters long."
                  inputComponent={PasswordInput}
                />
                <CustomFormControl
                  errors={errors}
                  name="confirmPassword"
                  label="Confirm Password"
                  register={register}
                  helperText="Re-type your password."
                  inputComponent={PasswordInput}
                />
                <Button w="100%" marginTop={9} isLoading={isSubmitting} type="submit">
                  Create Account
                </Button>
                <Text paddingTop={5}>
                  {"Already have an account? "}
                  <Link href="/login" fontWeight={700}>
                    Log in
                  </Link>
                </Text>
              </Stack>
            </form>
            <DividerWithText text="or continue with" />
            <Center>
              <Button
                colorScheme="gray"
                rightIcon={<FcGoogle />}
                w="100%"
                onClick={() => signIn("google")}
              >
                Google
              </Button>
            </Center>
          </Stack>
        </Container>
      </GridItem>
    </Grid>
  );
}
