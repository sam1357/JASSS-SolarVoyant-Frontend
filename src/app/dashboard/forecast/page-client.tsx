"use client";

import { Box, Center, Divider } from "@chakra-ui/react";
import { WeekWeatherCodes, energyDataObj } from "@src/interfaces";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@src/components/Dashboard/CardSet";
import DayEnergyCard from "@src/components/Dashboard/DayEnergyCard";

interface ForecastPageClientProps {
  weekWeatherCodes: WeekWeatherCodes;
  dailyEnergyData: energyDataObj;
}

export default function ForecastPageClient({ weekWeatherCodes, dailyEnergyData }: ForecastPageClientProps) {
  // TODO: Still working on organising this, setup below is just to show how to pass data
  console.log(dailyEnergyData);
  return (
    <>
      <Center>
        <Box width={"65%"} padding={5}>
          <CardSet data={weekWeatherCodes}></CardSet>
        </Box>
      </Center>
      <Center>
        <Divider width={"65%"} orientation="horizontal" />
      </Center>
      <Box width={"25%"} padding={5}>
        <DayEnergyCard energyDataName={"prod"} dailyEnergyData={dailyEnergyData} dayIndex={0}>
        </DayEnergyCard>
      </Box>
      <Box width={"25%"} padding={5}>
        <DayEnergyCard energyDataName={"cons"} dailyEnergyData={dailyEnergyData} dayIndex={0}>
        </DayEnergyCard>
      </Box>
    </>
  );
}
