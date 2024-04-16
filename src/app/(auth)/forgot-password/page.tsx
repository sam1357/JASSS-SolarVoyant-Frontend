"use client";

import {
  Box,
  Container,
  Grid,
  GridItem,
  Hide,
  Link,
  Text,
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
  useBreakpoint,
} from "@chakra-ui/react";
import Image from "next/image";
import { Step1 } from "@components/ForgotPassword/Step1";
import { Step2 } from "@components/ForgotPassword/Step2";
import { Step3 } from "@components/ForgotPassword/Step3";
import { useState } from "react";
import DividerWithText from "@src/components/DividerWithText";

export default function ForgotPasswordPage() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
  });
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const breakpoint = useBreakpoint();

  const steps = [
    {
      title: "First",
      description: "Enter your email",
      content: <Step1 increaseStep={setActiveStep} setEmail={setEmail} />,
    },
    {
      title: "Second",
      description: "Enter the token",
      content: <Step2 increaseStep={setActiveStep} setToken={setToken} email={email} />,
    },
    {
      title: "Third",
      description: "Reset your password",
      content: <Step3 setStep={setActiveStep} token={token} email={email} />,
    },
  ];

  return (
    <Grid templateColumns="repeat(3, 1fr)" minHeight={"100%"}>
      <Hide below="md">
        <GridItem w="100%" position="relative" bgGradient="linear(to-r, #FAD262, #FFECBA)">
          <Image src="/login.svg" alt="Solar panel" fill style={{ objectFit: "cover" }} />
        </GridItem>
      </Hide>
      <GridItem alignItems="center" display="flex" colSpan={{ base: 3, sm: 3, md: 2 }}>
        <Container>
          <Stepper
            index={activeStep}
            orientation={["base", "sm"].includes(breakpoint) ? "vertical" : "horizontal"}
            paddingBottom={30}
            width={"100%"}
          >
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
          {steps[activeStep].content}
          <Box pt={8} pb={6}>
            <DividerWithText text="OR" />
          </Box>
          <Text fontWeight={700}>
            Remember your password?{" "}
            <Link color="teal.500" href="/login">
              Login here.
            </Link>
          </Text>
        </Container>
      </GridItem>
    </Grid>
  );
}
