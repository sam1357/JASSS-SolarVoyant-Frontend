"use client";
import { Card, CardBody, Box, Heading, Text, Image, Center, HStack, VStack } from "@chakra-ui/react";
import { WeekWeatherCodes, energyDataObj, energyWithTimeStamp } from "@interfaces/index";
import { getDayOfWeek } from "./utils";
import { useEffect, useState } from "react";

interface DayNetEnergyCardProps {
    dailyEnergyData: energyDataObj;
    dayIndex: number;
}

// type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DayNetEnergyCard: React.FC<DayNetEnergyCardProps> = ({ dailyEnergyData, dayIndex }) => {
  const [rawVal, setRawVal] = useState(0);
  const [percVal, setPercVal] = useState(0);

  useEffect(() => {
    let rawVal = 0;
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
    <Card borderRadius="3xl" h="175px" minW="200px" w="50%">        
      <VStack display="flex" justifyContent="center" pt={2} h="100%">
        <Heading fontSize="2xl" fontWeight={200}>Net Energy</Heading>
        <HStack>
          <Heading fontSize="7xl" fontWeight={350} p={1}>
            {rawVal.toFixed(2)} w
          </Heading>
          <Heading fontSize="4xl" fontWeight={200}p={6}>
            or
          </Heading>
          <Heading fontSize="7xl" fontWeight={350} p={1}>
            {percVal.toFixed(2)} %
          </Heading>
        </HStack>
      </VStack>
    </Card>
  );
};
export default DayNetEnergyCard;
