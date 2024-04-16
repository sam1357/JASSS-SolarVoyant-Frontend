"use client";

import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Hide,
  Image,
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
} from "@chakra-ui/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Step1 } from "@components/ForgotPassword/Step1";
import { Step2 } from "@components/ForgotPassword/Step2";
import { Step3 } from "@components/ForgotPassword/Step3";
import { useState } from "react";

export default async function ForgotPasswordPage() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
  });
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

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
      content: <Step3 token={token} email={email} />,
    },
  ];

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
          {steps[activeStep].content}
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
        </Container>
      </GridItem>
    </Grid>
  );
}
