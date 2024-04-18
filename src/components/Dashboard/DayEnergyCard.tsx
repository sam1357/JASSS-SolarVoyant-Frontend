"use client";
import { Card, CardBody, Box, Heading, Text, Image, Center } from "@chakra-ui/react";
import { WeekWeatherCodes, energyDataObj, energyWithTimeStamp } from "@interfaces/index";
import { getDayOfWeek } from "./utils";
import { useEffect, useState } from "react";

interface dayEnergyCardProps {
    energyDataName: "prod" | "cons";
    dailyEnergyData: energyDataObj;
    dayIndex: number;
}

// type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DayEnergyCard: React.FC<dayEnergyCardProps> = ({ energyDataName, dailyEnergyData, dayIndex }) => {
  const [dataName, setDataName] = useState("");
  const [val, setVal] = useState(0);

  useEffect(() => {
    // Get the name of the day of the week
    const getDataName = () => {
      let dataName = "";
      if (energyDataName === "prod") {
        dataName = "Energy Production";
      } else {
        dataName = "Energy Consumption";
      }
      setDataName(dataName);
    };
    getDataName();

    const getVal = () => {
      let val = 0;
      if (energyDataName === "prod") {
        val = (dailyEnergyData.production as energyWithTimeStamp[])[dayIndex].value;
      } else {
        val = (dailyEnergyData.consumption as energyWithTimeStamp[])[dayIndex].value;
      }
      setVal(val);
    };
    getVal();

  }, []); // eslint-disable-line

  return (
    <Card borderRadius="3xl" _hover={{ bg: "#0095e6" }}>
      <CardBody>
        <Heading fontSize="xl" textAlign="center">
          {dataName}
        </Heading>
        <Box>
          <Text fontSize="md" textAlign="center">
            {val.toFixed(2)} W
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};
export default DayEnergyCard;
