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
import CustomFormControl from "./CustomFormControl";
import { PasswordInput, Persona, PersonaAvatar, useForm } from "@saas-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GooglePlacesAutocompleteOption, Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import SliderFieldToggle from "../SliderFieldToggle";
import SetLocation from "./SetLocation";
import { LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAP_DARK_ID, GOOGLE_MAP_LIGHT_ID } from "@src/constants";
import Autocomplete from "../Choropleth/Autocomplete";

interface CustomUserDataContainerProps {
  session: Session;
}
const libraries = ["places"];


const UserDataContainer: React.FC<CustomUserDataContainerProps> = ({ session }) => {
  const [selectedPlace, setSelectedPlace] = useState<GooglePlacesAutocompleteOption>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const sizeHeading = "What is the surface area of your solar panels?"
  const sizeSubheading = "Toggle the switch if you are unsure to select from common solar panel sizes"
  const locationHeading = "Where is your solar-powered home located?"
  const locationSubheading = "Toggle the switch if you wish to provide a suburb rather than an address"
  const steps = [
  { title: "Set Location", content: <SetLocation session={session} heading={locationHeading} subheading={locationSubheading}/>},
  { title: "Select Solar Panel Size", content: <SliderFieldToggle session={session} heading={sizeHeading} subheading={sizeSubheading}/>},
  { title: "Estimate your energy profile", content: <SliderFieldToggle session={session} heading={sizeHeading} subheading={sizeSubheading}/> },
];

const { activeStep, setActiveStep } = useSteps({
  index: 1,
  count: steps.length,
});

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
        <Box h={"100%"} mt={"10%"}>
            {steps[activeStep].content}
        </Box>
      </Box>
    </Box>
  );
};

export default UserDataContainer;
