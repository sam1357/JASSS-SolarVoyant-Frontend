"use client";

import { Box, Center, Divider } from "@chakra-ui/react";
import { energyDataObj, NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@src/components/Dashboard/CardSet";
import Graph, { HOURLY_CONDITIONS } from "@src/components/Dashboard/Graph";

interface ForecastPageClientProps {
  result: WeekWeatherCodes;
  weatherData: NextWeekHourlyData | undefined;
  energyData: energyDataObj;
}

export default function ForecastPageClient({
  result,
  weatherData,
  energyData,
}: ForecastPageClientProps) {
  // TODO: Still working on organising this, setup below is just to show how to pass data
  return (
    <>
      <Center>
        <Box width={"65%"} padding={5}>
          <CardSet data={result}></CardSet>
        </Box>
      </Center>
      <Center>
        <Divider width={"65%"} orientation="horizontal" />
      </Center>
      <Box padding={5} borderRadius="3xl">
        <Graph
          hourlyWeatherData={weatherData}
          hourlyEnergyData={energyData}
          indexDay={0} // you can make this variable based on the weather card
          schema={HOURLY_CONDITIONS}
        ></Graph>
      </Box>
    </>
  );
}
