"use client";
import { Card, Heading, HStack, VStack, useColorMode } from "@chakra-ui/react";
import { energyDataObj, energyWithTimeStamp } from "@interfaces/index";
import { useEffect, useState } from "react";

interface WeekEnergyCardProps {
  energyDataName: "prod" | "cons" | "net";
  weekEnergyData: energyDataObj;
}

const WeekEnergyCard: React.FC<WeekEnergyCardProps> = ({ energyDataName, weekEnergyData }) => {
  const [dataName, setDataName] = useState("");
  const [val, setVal] = useState(0);
  const [unit, setUnit] = useState("");

  const { colorMode } = useColorMode();
  useEffect(() => {
    // Get the name of the day of the week
    const getDataName = () => {
      let dataName = "";
      if (energyDataName === "prod") {
        dataName = "Energy Production";
      } else if (energyDataName === "cons") {
        dataName = "Energy Consumption";
      } else {
        dataName = "Net Energy";
      }
      setDataName(dataName);
    };
    getDataName();

    const getVal = () => {
      let val = 0;
      if (energyDataName === "prod") {
        val = (weekEnergyData.production as energyWithTimeStamp).value;
      } else if (energyDataName === "cons") {
        val = (weekEnergyData.consumption as energyWithTimeStamp).value;
      } else {
        val = (weekEnergyData.net as energyWithTimeStamp).value;
      }
      setVal(val);
    };
    getVal();

    const getUnit = () => {
      let unit = "";
      if (energyDataName === "prod") {
        unit = "w";
      } else if (energyDataName === "cons") {
        unit = "w";
      } else {
        unit = "%";
      }
      setUnit(unit);
    };
    getUnit();
  }, [weekEnergyData]); // eslint-disable-line

  let netColor: string;
  if (dataName === "Net Energy") {
    if (val >= 0) {
      netColor = "green.500";
    } else {
      if (colorMode === "light") {
        netColor = "orange.400";
      } else {
        netColor = "orange.500";
      }
    }
  } else {
    netColor = "whiteAlpha.200";
  }

  return (
    <Card borderRadius="3xl" h="210px" backgroundColor={netColor}>
      <VStack display="flex" justifyContent="center" alignContent="center" pt={2} h="100%">
        <Heading fontSize="2xl" fontWeight={200}>
          {dataName}
        </Heading>
        <HStack>
          <Heading fontSize="6xl" fontWeight={350} p={1}>
            {val.toFixed(2)} {unit}
          </Heading>
        </HStack>
      </VStack>
    </Card>
  );
};
export default WeekEnergyCard;
