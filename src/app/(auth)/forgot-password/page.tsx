"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Hide,
  Image,
  Link,
  Stack,
  Text,
  useToast,
  useSteps,
  Stepper,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Step,
} from "@chakra-ui/react";
import CustomFormControl from "@src/components/AuthPages/CustomFormControl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoMdArrowRoundBack } from "react-icons/io";

interface LoginSubmitValue {
  email: string;
}

const steps = [
  { title: "First", description: "Enter your email" },
  { title: "Second", description: "Enter the token" },
  { title: "Third", description: "Reset your password" },
];

const content = [
  {
    title: "Forgot Password?",
    description: "Enter the email address tied to your account.",
    name: "email",
    label: "Email address",
    placeholder: "example@example.com",
  },
  {
    title: "Reset Token",
    description: "We have sent a code to your email.",
    name: "token",
    label: "Token",
    placeholder: "",
  },
  {
    title: "Reset Password",
    description: "Please enter your new password.",
    name: "email",
    label: "Email address",
    placeholder: "example@example.com",
  },
];

const schema = yup
  .object({
    email: yup.string().required("Email is required.").email("Please provide a valid email."),
  })
  .required();

export default async function ForgotPasswordPage() {
  const toast = useToast();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSubmitValue>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginSubmitValue) => {
    const sendEmail = async () => {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      return res;
    };

    sendEmail().then(async (res: any) => {
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
        setActiveStep(activeStep + 1);
      }
    });
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" minHeight={"100%"}>
      <Hide below="md">
        <GridItem
          w="100%"
          position="relative"
          bgGradient="linear(to-r, #FAD262, #FFECBA)"
          objectPosition={"fixed"}
        >
          <Image src="/login.svg" alt="Solar panel" fill={"true"} style={{ objectFit: "cover" }} />
        </GridItem>
      </Hide>
      <GridItem alignItems="center" display="flex" colSpan={{ base: 3, sm: 3, md: 2 }}>
        <Container>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper index={activeStep} orientation="horizontal" paddingBottom={100} width={"100%"}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            <Stack gap={5}>
              <Heading size="2xl" color="blue.500">
                {content[activeStep].title}
              </Heading>
              <Text size="lg" fontWeight={300}>
                {content[activeStep].description}
              </Text>
              <Stack gap={1}>
                <CustomFormControl
                  errors={errors}
                  name={content[activeStep].name}
                  label={content[activeStep].label}
                  placeholder={content[activeStep].placeholder}
                  register={register}
                />
              </Stack>
            </Stack>
            <Container paddingTop={100}>
              <Button w="100%" type="submit">
                Send Password Reset Email
              </Button>
            </Container>
            <Container
              fontWeight={700}
              paddingY={2}
              paddingX={0}
              display="flex"
              justifyContent="center"
            >
              <Link href="/login" paddingBottom={7}>
                <Flex padding={2}>
                  <Box paddingTop={1}>
                    <IoMdArrowRoundBack />
                  </Box>
                  <Text paddingLeft={1}>Back to log in</Text>
                </Flex>
              </Link>
            </Container>
          </form>
        </Container>
      </GridItem>
    </Grid>
  );
}
