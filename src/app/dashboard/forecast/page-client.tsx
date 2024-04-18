"use client";

import { Box, Card, Divider, Flex, Grid, GridItem, HStack } from "@chakra-ui/react";
import {
  AverageDailyInWeekWeatherData,
  Conditions,
  energyDataObj,
  NextWeekHourlyData,
  Units,
  WeekWeatherCodes,
} from "@src/interfaces";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@components/Dashboard/CardSet";
import Insights from "@components/Dashboard/Insights";
import { useState } from "react";
import GaugeSet from "@src/components/Dashboard/GaugeSet";
import Graph, { HOURLY_CONDITIONS } from "@src/components/Dashboard/Graph";

interface ForecastPageClientProps {
  result: WeekWeatherCodes;
  weatherData: NextWeekHourlyData | undefined;
  energyData: energyDataObj;
  averageConditions: AverageDailyInWeekWeatherData;
}

export default function ForecastPageClient({
  result,
  weatherData,
  energyData,
  averageConditions,
}: ForecastPageClientProps) {
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const conditionOfDay: Conditions & { units: Units } = {
    ...averageConditions[selectedCard],
    units: averageConditions.units,
  };

  return (
    <Box width={"100%"} padding={5}>
      <Flex justifyContent="center" pb={1}>
        <CardSet data={result} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
      </Flex>
      <Divider pb={10} />
      <Grid templateRows="repeat(5, 1fr)" gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }} my={10}>
        <GridItem rowSpan={1} h="100%" pr={2} overflowX="scroll">
          <HStack gap={6} w="100%">
            <Card borderRadius="3xl" h="200px" minW="200px" w="33%" />
            <Card borderRadius="3xl" h="200px" minW="200px" w="33%" />
            <Card borderRadius="3xl" h="200px" minW="200px" w="33%" />
          </HStack>
        </GridItem>
        <GridItem rowSpan={4}>
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }}
            mr={2}
          >
            <GridItem colSpan={{ base: 3, sm: 3, md: 3, lg: 3, xl: 2 }}>
              <Grid
                templateRows="repeat(3, 1r)"
                gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }}
                height={"100%"}
              >
                <GridItem rowSpan={1}>
                  {weatherData && (
                    <Insights data={weatherData} isWeekly={false} selectedCard={selectedCard} />
                  )}
                </GridItem>
                <GridItem rowSpan={2}>
                  <Graph
                    hourlyWeatherData={weatherData}
                    hourlyEnergyData={energyData}
                    indexDay={selectedCard} // you can make this variable based on the weather card
                    schema={HOURLY_CONDITIONS}
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem colSpan={{ base: 3, sm: 3, md: 3, lg: 3, xl: 1 }} overflowY="scroll">
              <GaugeSet data={conditionOfDay} />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
}
