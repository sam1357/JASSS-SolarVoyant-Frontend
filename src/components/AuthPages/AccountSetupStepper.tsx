"use client";

import React from "react";
import {
  Box,
  Text,
  Divider,
  Stack,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepSeparator,
  Flex,
  useBreakpoint,
  Heading,
  Wrap,
} from "@chakra-ui/react";

import { Session } from "@src/interfaces";
import SliderFieldToggle from "@components/SliderFieldToggle";
import SetLocation from "@components/AuthPages/SetLocation";
import SetEnergyProfile from "@components/AuthPages/SetEnergyProfile";

interface CustomUserDataContainerProps {
  session: Session;
}

const UserDataContainer: React.FC<CustomUserDataContainerProps> = ({ session }) => {
  const sizeHeading = "What is the surface area of your solar panels?";
  const sizeSubheading =
    "Toggle the switch if you are unsure to select from common solar panel sizes";
  const locationHeading = "Where is your solar-powered home located?";
  const locationSubheading = "Enter an address or suburb within NSW";

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const handleCompleteStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const steps = [
    {
      title: "Set Location",
      content: (
        <SetLocation
          session={session}
          heading={locationHeading}
          subheading={locationSubheading}
          onComplete={handleCompleteStep}
        />
      ),
    },
    {
      title: "Select Solar Panel Size",
      content: (
        <SliderFieldToggle
          session={session}
          heading={sizeHeading}
          subheading={sizeSubheading}
          onComplete={handleCompleteStep}
          setStep={setActiveStep}
        />
      ),
    },
    {
      title: "Estimate your energy profile",
      content: (
        <SetEnergyProfile
          session={session}
          heading={"How big is your household?"}
          subheading={locationSubheading}
          onComplete={handleCompleteStep}
          setStep={setActiveStep}
        />
      ),
    },
  ];

  const breakpoint = useBreakpoint();

  return (
    <Flex justify="center" align="center" h="95%" overflowY="hidden">
      <Box h="auto" w="80%" p={4} borderWidth="1px" borderRadius="lg" mx={"auto"} mt={"10"}>
        <Stack width={"95%"} mt={0} mx={"auto"} spacing={1}>
          <Wrap gap={2}>
            <Heading>Welcome onboard</Heading>
            <Heading color="primary.500">{session?.user?.name}!</Heading>
          </Wrap>
          <Text>
            Your answers will help us better predict your energy bills. You can change these later.
          </Text>
          <Stepper
            size="lg"
            index={activeStep}
            mt={4}
            orientation={
              ["base", "sm", "md", "lg"].includes(breakpoint) ? "vertical" : "horizontal"
            }
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
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Divider my={2} />
        </Stack>
        <Box h="90%" width={"95%"} mx={"auto"}>
          <Box h={"100%"}>{steps[activeStep].content}</Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default UserDataContainer;
