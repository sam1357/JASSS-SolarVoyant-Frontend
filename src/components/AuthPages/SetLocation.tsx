"use client";

import React, { useState } from "react";
import { Text, Box, Button, useToast, Spinner, Stack } from "@chakra-ui/react";
import { GooglePlacesAutocompleteOption, Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import { LoadScriptNext } from "@react-google-maps/api";
import { LIBRARIES } from "@src/constants";
import Autocomplete from "@components/Choropleth/Autocomplete";
import { findSuburbName } from "@src/utils/utils";

interface SetLocationProps {
  session: Session;
  heading: string;
  subheading: string;
  onComplete: () => void;
}

const SetLocation: React.FC<SetLocationProps> = ({ session, heading, subheading, onComplete }) => {
  const [selectedPlace, setSelectedPlace] = useState<GooglePlacesAutocompleteOption>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onUserSubmit = async () => {
    setLoading(true);
    if (!selectedPlace) {
      toast({
        title: "Error",
        description: "Please select a place before submitting.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    if (!selectedPlace.value.terms.some((e) => e.value === "NSW")) {
      toast({
        title: "Error",
        description: "Please select a place in New South Wales.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;
    }

    const info = {
      suburb: findSuburbName(selectedPlace.value.terms),
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
          onComplete();
        }
      });
    }
    setLoading(false);
  };

  return (
    <Box
      width={"100%"}
      height="90%"
      display="flex"
      pt={4}
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Stack direction="column" gap={4} my={4} textAlign="left">
          <Text fontSize="xl" fontWeight={600}>
            {heading}
          </Text>
          <Text fontSize="lg">{subheading}</Text>
        </Stack>
        <Box>
          <LoadScriptNext
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
            libraries={LIBRARIES as any}
            loadingElement={<Spinner />}
          >
            <Autocomplete onSelect={setSelectedPlace} onClose={() => {}} />
          </LoadScriptNext>
        </Box>
      </Box>
      <Button
        mt={6}
        mb={4}
        width={{ base: "100%", sm: "100%", md: "50%", lg: "20%" }}
        type="submit"
        isLoading={loading}
        onClick={onUserSubmit}
        alignSelf="center"
      >
        Submit
      </Button>
    </Box>
  );
};

export default SetLocation;
