"use client";

import React, { useState } from "react";
import { Text, Box, Button, Grid, GridItem, useToast } from "@chakra-ui/react";
import { GooglePlacesAutocompleteOption, Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import { LoadScriptNext } from "@react-google-maps/api";
import { GOOGLE_MAP_DARK_ID, GOOGLE_MAP_LIGHT_ID } from "@src/constants";
import Autocomplete from "../Choropleth/Autocomplete";

interface SetLocationProps {
  session: Session;
  heading: string;
  subheading: string;
  onComplete: () => void;
}

const libraries = ["places"];

const SetLocation: React.FC<SetLocationProps> = ({ session, heading, subheading, onComplete }) => {
  const [selectedPlace, setSelectedPlace] = useState<GooglePlacesAutocompleteOption>();
  const toast = useToast();

  const onUserSubmit = async () => {
    if (!selectedPlace) {
      toast({
        title: "Error",
        description: "Please select a place before submitting.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const info = {
      suburb: selectedPlace.value.structured_formatting.main_text,
    };

    if (session?.user?.email && session?.user?.id) {
      await Api.setUserData(session.user.id, info).then(async (res) => {
        if (res?.status !== 200) {
          toast({
            title: "Error",
            description: (await res.json()).error,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
        } else {
          toast({
            title: "Success",
            description: "Changes will be applied on next sign in",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
          onComplete();
        }
      });
    }
  };

  return (
    <Box my={"auto"} width={"100%"} mx={"auto"} height="80vh">
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
        mapIds={[GOOGLE_MAP_LIGHT_ID, GOOGLE_MAP_DARK_ID]}
      >
        <Autocomplete onSelect={setSelectedPlace} onClose={() => {}} />
      </LoadScriptNext>

      <Button type="submit" w={"100%"} mt={"25%"} onClick={onUserSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default SetLocation;
