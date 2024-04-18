"use client";

import { Box, Divider, Flex, Grid, GridItem, HStack } from "@chakra-ui/react";
import {
  AverageDailyInWeekWeatherData,
  Conditions,
  NextWeekHourlyData,
  Units,
  WeekWeatherCodes,
  energyDataObj,
} from "@src/interfaces";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@components/Dashboard/CardSet";
import Insights from "@components/Dashboard/Insights";
import { useState } from "react";
import GaugeSet from "@src/components/Dashboard/GaugeSet";
import DayEnergyCard from "@src/components/Dashboard/DayEnergyCard";
import DayNetEnergyCard from "@src/components/Dashboard/DayNetEnergyCard";
import Graph, { HOURLY_CONDITIONS } from "@src/components/Dashboard/Graph";

interface ForecastPageClientProps {
  weatherData: NextWeekHourlyData | undefined;
  energyData: energyDataObj;
  averageConditions: AverageDailyInWeekWeatherData;
  weekWeatherCodes: WeekWeatherCodes;
  dailyEnergyData: energyDataObj;
}

export default function ForecastPageClient({
  weatherData,
  energyData,
  averageConditions,
  weekWeatherCodes,
  dailyEnergyData,
}: ForecastPageClientProps) {
  const [selectedCard, setSelectedCard] = useState<number>(0); // INDEX
  const conditionOfDay: Conditions & { units: Units } = {
    ...averageConditions[selectedCard],
    units: averageConditions.units,
  };

  return (
    <Box width={"100%"} padding={5}>
      <Flex justifyContent="center" pb={1}>
        <CardSet
          data={weekWeatherCodes}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      </Flex>
      <Divider pb={10} />
      <Grid templateRows="repeat(5, 1fr)" gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }} my={10}>
        <GridItem rowSpan={1} h="100%" pr={2} overflowX="scroll">
          <HStack gap={2} w="100%">
            <DayEnergyCard
              energyDataName={"prod"}
              dailyEnergyData={dailyEnergyData}
              dayIndex={selectedCard}
            ></DayEnergyCard>

            <DayEnergyCard
              energyDataName={"cons"}
              dailyEnergyData={dailyEnergyData}
              dayIndex={selectedCard}
            ></DayEnergyCard>

            <DayNetEnergyCard
              dailyEnergyData={dailyEnergyData}
              dayIndex={selectedCard}
            ></DayNetEnergyCard>
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
                {/* <GridItem rowSpan={1}> */}
                {weatherData && (
                  <Insights data={weatherData} isWeekly={false} selectedCard={selectedCard} />
                )}
                {/* </GridItem> */}
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
