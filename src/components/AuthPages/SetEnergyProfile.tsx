"use client";

import React, { useState } from "react";
import { Box, Button, useToast } from "@chakra-ui/react";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import SliderToggle from "../SliderToggle";
import SliderOptionalToggle from "../SliderOptionalToggle";
import transformQuarterlyConsumption from "@src/utils/transformQuarterlyConsumption";

interface SetLocationProps {
  session: Session;
  heading: string;
  subheading: string;
  onComplete: () => void;
}

interface EnergyGeneration {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

const SetLocation: React.FC<SetLocationProps> = ({ session, onComplete }) => {
  const [energyConsumption, setEnergyConsumption] = useState({});
  const [energyGeneration, setEnergyGeneration] = useState<EnergyGeneration>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });
  const toast = useToast();

  const handleEnergyConsumptionChange = (data: React.SetStateAction<{}>) => {
    setEnergyConsumption((prev) => ({ ...prev, ...data }));
  };

  const handleEnergyGenerationChange = (data: React.SetStateAction<{}>) => {
    setEnergyGeneration((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    const consumptionData = transformQuarterlyConsumption(energyConsumption);
    const generationData = energyGeneration;
    const info = {
      quarterly_energy_consumption: consumptionData,
      q1_w: generationData.q1,
      q2_w: generationData.q2,
      q3_w: generationData.q3,
      q4_w: generationData.q4,
    };

    if (session?.user?.email && session?.user?.id) {
      await Api.setUserData(session.user.id, info)
        .then(async (res) => {
          if (res?.status !== 200) {
            const error = await res.json();
            toast({
              title: "Error updating data",
              description: error.error || "Failed to update user data.",
              status: "error",
              position: "top",
              duration: 4000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Success",
              description:
                "All changes have been successfully applied and will be active on next sign in.",
              status: "success",
              position: "top",
              duration: 4000,
              isClosable: true,
            });
            onComplete();
          }
        })
    }
  };

  return (
    <Box width={"100%"} mx={"auto"}>
      <SliderToggle
        session={session}
        onEnergyConsumptionChange={handleEnergyConsumptionChange}
      ></SliderToggle>
      <SliderOptionalToggle
        session={session}
        onEnergyGenerationChange={handleEnergyGenerationChange}
      ></SliderOptionalToggle>
      <Button onClick={handleSubmit} w={"100%"}>
        Update Details
      </Button>
    </Box>
  );
};

export default SetLocation;
