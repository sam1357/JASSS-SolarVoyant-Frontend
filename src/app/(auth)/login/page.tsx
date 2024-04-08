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
import { PasswordInput } from "@saas-ui/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import DividerWithText from "@components/DividerWithText";
import CustomFormControl from "@components/AuthPages/CustomFormControl";

interface LoginSubmitValues {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .required("Email is required.")
      .email("Please provide a valid email."),
    password: yup.string().required("Password is required."),
  })
  .required();

export default function LoginPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginSubmitValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginSubmitValues) => {
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
        router.push("/dashboard/overview");
      }
    });
  };

  useEffect(() => {
    const error = searchParams.get("error");

    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Grid templateColumns="repeat(3, 1fr)" minHeight={"100%"}>
      <Hide below="md">
        <GridItem
          w="100%"
          position="relative"
          bgGradient="linear(to-r, #FAD262, #FFECBA)"
        >
          <Image
            src="/login.svg"
            alt="Solar panel"
            fill
            style={{ objectFit: "cover" }}
          />
        </GridItem>
      </Hide>
      <GridItem
        alignItems="center"
        display="flex"
        colSpan={{ base: 3, sm: 3, md: 2 }}
      >
        <Container>
          <Stack gap={5}>
            <Heading size="2xl" color="blue.500">
              Welcome Back!
            </Heading>
            <Text size="lg" fontWeight={300}>
              Enter your login details.
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap={1}>
                <CustomFormControl
                  errors={errors}
                  name="email"
                  label="Email address"
                  placeholder="example@example.com"
                  register={register}
                />
                <CustomFormControl
                  errors={errors}
                  name="password"
                  label="Password"
                  register={register}
                  inputComponent={PasswordInput}
                />
                <Container
                  paddingY={2}
                  paddingX={0}
                  display="flex"
                  justifyContent="right"
                >
                  <Link
                    href="/forgot-password"
                    fontWeight={700}
                    paddingBottom={7}
                  >
                    Forgot Password?
                  </Link>
                </Container>
                <Button w="100%" type="submit" isLoading={isSubmitting}>
                  Login
                </Button>
                <Text paddingTop={5}>
                  {"Don't have an account? "}
                  <Link href="/signup" fontWeight={700}>
                    Sign up here!
                  </Link>
                </Text>
              </Stack>
            </form>
            <DividerWithText text="or continue with" />
            <Center>
              <Button
                colorScheme="gray"
                w="100%"
                rightIcon={<FcGoogle />}
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
