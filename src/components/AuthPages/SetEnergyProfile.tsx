"use client";

import React, { useState } from "react";
import { Box, Button, ButtonGroup, useToast } from "@chakra-ui/react";
import { Session } from "@src/interfaces";
import { Api } from "@utils/Api";
import SliderToggle from "../SliderToggle";
import SliderOptionalToggle from "../SliderOptionalToggle";
import transformQuarterlyConsumption from "@src/utils/transformQuarterlyConsumption";
import { useRouter } from "next/navigation";
import { DEFAULT_NOTIF_LIMIT } from "@src/constants";

interface SetLocationProps {
  session: Session;
  heading: string;
  subheading: string;
  onComplete: () => void;
  setStep: (step: number) => void; // eslint-disable-line
}

interface EnergyGeneration {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  use: string;
}

const SetLocation: React.FC<SetLocationProps> = ({ session, onComplete, setStep }) => {
  const router = useRouter();
  const [energyConsumption, setEnergyConsumption] = useState({
    householdMembers: "2",
    use: "householdMembers",
  });
  const [energyGeneration, setEnergyGeneration] = useState<EnergyGeneration>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    use: "easy",
  });
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnergyConsumptionChange = (data: React.SetStateAction<{}>) => {
    setEnergyConsumption((prev) => ({ ...prev, ...data }));
  };

  const handleEnergyGenerationChange = (data: React.SetStateAction<{}>) => {
    setEnergyGeneration((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const consumptionData = transformQuarterlyConsumption(energyConsumption);
    if (consumptionData === "") {
      toast({
        title: "Error",
        description: "Please fill in all the consumption fields.",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

    if (energyGeneration.use === "custom") {
      if (
        energyGeneration.q1 === "" ||
        energyGeneration.q2 === "" ||
        energyGeneration.q3 === "" ||
        energyGeneration.q4 === ""
      ) {
        toast({
          title: "Error",
          description: "Please fill in all the generation fields.",
          status: "error",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
        setIsSubmitting(false);
        return;
      }
    }

    const useDefault = energyGeneration.use === "easy";

    const info = {
      quarterly_energy_consumption: consumptionData,
      q1_w: useDefault ? "1000" : energyGeneration.q1,
      q2_w: useDefault ? "800" : energyGeneration.q2,
      q3_w: useDefault ? "600" : energyGeneration.q3,
      q4_w: useDefault ? "800" : energyGeneration.q4,
      lower_limit: DEFAULT_NOTIF_LIMIT,
      receive_emails: "true",
    };

    if (session?.user?.email && session?.user?.id) {
      await Api.setUserData(session.user.id, info).then(async (res) => {
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
            description: "All done! You can now view your energy profile and explore your options.",
            status: "success",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
          onComplete();
          router.push("/dashboard/overview");
        }
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Box width={"100%"} mx={"auto"}>
      <SliderToggle onEnergyConsumptionChange={handleEnergyConsumptionChange} />
      <SliderOptionalToggle
        session={session}
        onEnergyGenerationChange={handleEnergyGenerationChange}
      />
      <Box display="flex" justifyContent="center">
        <ButtonGroup
          width={{ base: "100%", sm: "100%", md: "50%", lg: "20%" }}
          justifyContent="center"
        >
          <Button w="40%" onClick={() => setStep(1)} colorScheme="gray">
            Back
          </Button>
          <Button isLoading={isSubmitting} type="submit" w="60%" onClick={handleSubmit}>
            Update Details
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default SetLocation;
