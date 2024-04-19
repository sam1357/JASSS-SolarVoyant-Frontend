"use client";
import { Card, Heading, Stack, useBreakpoint, VStack } from "@chakra-ui/react";
import { energyDataObj, energyWithTimeStamp } from "@interfaces/index";
import { useEffect, useState } from "react";

interface DayNetEnergyCardProps {
  dailyEnergyData: energyDataObj;
  dayIndex: number;
}

// type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const DayNetEnergyCard: React.FC<DayNetEnergyCardProps> = ({ dailyEnergyData, dayIndex }) => {
  const breakPoint = useBreakpoint();

  const [rawVal, setRawVal] = useState(0);
  const [percVal, setPercVal] = useState(0);

  useEffect(() => {
    const getRawVal = () => {
      let rawVal = (dailyEnergyData.netRaw as energyWithTimeStamp[])[dayIndex].value;
      setRawVal(rawVal);
    };
    getRawVal();

    const getPercVal = () => {
      let percVal = (dailyEnergyData.net as energyWithTimeStamp[])[dayIndex].value;
      setPercVal(percVal);
    };
    getPercVal();
  }, [dayIndex]); // eslint-disable-line

  return (
    <Card
      borderRadius="3xl"
      h="175px"
      minW="300px"
      w="50%"
      backgroundColor={rawVal >= 0 ? "green.500" : "orange.500"}
    >
      <VStack display="flex" justifyContent="center" pt={2} h="100%">
        <Heading fontSize="2xl" fontWeight={200}>
          Net Energy
        </Heading>
        <Stack direction={["base", "sm", "md", "lg"].includes(breakPoint) ? "column" : "row"}>
          <Heading
            fontSize={{ base: "lg", lg: "3xl", xl: "5xl", "2xl": "6xl" }}
            fontWeight={350}
            p={1}
          >
            {rawVal.toFixed(2)} w
          </Heading>
          <Heading
            fontSize={{ base: "md", lg: "xl", xl: "2xl", "2xl": "3xl" }}
            fontWeight={200}
            p={{ base: 2, xl: 6 }}
            textAlign="center"
          >
            or
          </Heading>
          <Heading
            fontSize={{ base: "lg", lg: "3xl", xl: "5xl", "2xl": "6xl" }}
            fontWeight={350}
            p={1}
          >
            {percVal.toFixed(2)} %
          </Heading>
        </Stack>
      </VStack>
    </Card>
  );
};
export default DayNetEnergyCard;
