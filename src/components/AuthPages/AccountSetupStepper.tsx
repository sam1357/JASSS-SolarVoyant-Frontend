"use client";

import React, { useRef, useState } from "react";
import {
  Text,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Stack,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useDisclosure,
} from "@chakra-ui/react";

import { GooglePlacesAutocompleteOption, Session } from "@src/interfaces";
import SliderFieldToggle from "../SliderFieldToggle";
import SetLocation from "./SetLocation";
import { LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAP_DARK_ID, GOOGLE_MAP_LIGHT_ID } from "@src/constants";
import Autocomplete from "../Choropleth/Autocomplete";
import SetEnergyProfile from "./SetEnergyProfile";

interface CustomUserDataContainerProps {
  session: Session;
}

const UserDataContainer: React.FC<CustomUserDataContainerProps> = ({ session }) => {
  const sizeHeading = "What is the surface area of your solar panels?";
  const sizeSubheading = "Toggle the switch if you are unsure to select from common solar panel sizes";
  const locationHeading = "Where is your solar-powered home located?";
  const locationSubheading = "Enter an address or suburb within NSW";
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const handleCompleteStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prevStep => prevStep + 1);
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
        <SliderFieldToggle session={session} heading={sizeHeading} subheading={sizeSubheading} onComplete={handleCompleteStep}/>
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
      />
      ),
    },
  ];

  return (
    <Box h="70vh" w="80%" p={4} borderWidth="1px" borderRadius="lg" mx={"auto"} mt={"10"}>
      <Stack width={"95%"} mt={0} mx={"auto"} spacing={1}>
        <Stepper size="lg" index={activeStep} mt={4}>
          {steps.map((step, index) => (
            <Step key={index} onClick={() => setActiveStep(index)}>
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

        <Divider mt={2} />
      </Stack>

      <Box h={"80%"} width={"95%"} mx={"auto"}>
        <Box h={"100%"}>
          {steps[activeStep].content}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDataContainer;
