"use client";
import { Card, Heading, HStack, VStack } from "@chakra-ui/react";
import { energyDataObj, energyWithTimeStamp } from "@interfaces/index";
import { useEffect, useState } from "react";

interface dayEnergyCardProps {
  energyDataName: "prod" | "cons";
  dailyEnergyData: energyDataObj;
  dayIndex: number;
}

// type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DayEnergyCard: React.FC<dayEnergyCardProps> = ({
  energyDataName,
  dailyEnergyData,
  dayIndex,
}) => {
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
  }, [dayIndex]); // eslint-disable-line

  return (
    <Card borderRadius="3xl" h="175px" minW="200px" w="25%">
      <VStack display="flex" justifyContent="center" alignContent="center" pt={2} h="100%">
        <Heading fontSize="2xl" fontWeight={200}>
          {dataName}
        </Heading>
        <HStack>
          <Heading fontSize="7xl" fontWeight={350} p={1}>
            {val.toFixed(2)} w
          </Heading>
        </HStack>
      </VStack>
    </Card>
  );
};
export default DayEnergyCard;
