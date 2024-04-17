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
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Link,
  Switch,
  Slider,
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
import { LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAP_DARK_ID, GOOGLE_MAP_LIGHT_ID } from "@src/constants";
import Autocomplete from "../Choropleth/Autocomplete";

interface CustomUserDataContainerProps {
  session: Session;
  heading: string;
  subheading: string;
}

interface UserEmailFormData {
  placeId?: GooglePlacesAutocompleteOption; 
}

const libraries = ["places"];

const SetLocation: React.FC<CustomUserDataContainerProps> = ({ session, heading, subheading }) => {
    const [selectedPlace, setSelectedPlace] = useState<GooglePlacesAutocompleteOption>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();
    
    const onUserSubmit = async () => {
      if (!selectedPlace) {
          toast({
            title: "Error",
            description: "Please select a place before submitting.",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top"
          });
          return;
      }

      const info = {
          address: selectedPlace.toString(),
      };

      if (session?.user?.email && session?.user?.id) {
        console.log(selectedPlace);
          await Api.setUserData(session.user.id, info).then(async (res) => {
              if (res?.status !== 200) {
                  toast({
                    title: "Error",
                    description: (await res.json()).error,
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                  });
              } else {
                  toast({
                    title: "Success",
                    description: "Changes will be applied on next sign in",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "top"
                  });
              }
          });
      }
  };

//   What is the surface area of your solar panels?
// Toggle the switch if you are unsure to select from common solar panel sizes
  return (
    
    <Box my={"auto"} width={"100%"} mx={"auto"} height="100%">
                  <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={8}>
            <GridItem>
              <Text fontSize="md">
                <b>{heading}</b>
              </Text>
              <Text fontSize="sm">{subheading}</Text>
            </GridItem>
          </Grid>
        <LoadScriptNext
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
            libraries={libraries as any}
            mapIds={[GOOGLE_MAP_LIGHT_ID, GOOGLE_MAP_DARK_ID]}>
            <Autocomplete onSelect={setSelectedPlace} onClose={() => {}} />
          </LoadScriptNext>

          <Button
              type="submit"
              w={"100%"}
              mt={20}
              onClick={onUserSubmit}
            >
                Submit
            </Button>
    </Box>
  );
};

export default SetLocation;

function toast(arg0: { title: string; description: string; status: string; position: string; duration: number; isClosable: boolean; }) {
  throw new Error("Function not implemented.");
}
 