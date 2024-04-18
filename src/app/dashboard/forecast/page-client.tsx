"use client";

import { AbsoluteCenter, Box, Card, Center, Divider, Flex, Grid, GridItem, HStack, useBreakpoint } from "@chakra-ui/react";
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
import { useEffect, useState } from "react";
import GaugeSet from "@src/components/Dashboard/GaugeSet";
import DayEnergyCard from "@src/components/Dashboard/DayEnergyCard";
import DayNetEnergyCard from "@src/components/Dashboard/DayNetEnergyCard";
import Graph, { HOURLY_CONDITIONS } from "@src/components/Dashboard/Graph";
import GaugeCard from "@src/components/Dashboard/GaugeCard";

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
  dailyEnergyData
}: ForecastPageClientProps) {
  const [selectedCard, setSelectedCard] = useState<number>(0); // INDEX
  const conditionOfDay: Conditions & { units: Units } = {
    ...averageConditions[selectedCard],
    units: averageConditions.units,
  };

  const breakPoint = useBreakpoint();
  useEffect(() => {
    console.log(breakPoint);
  }, [breakPoint]);

  return (
    <Box width={"100%"} padding={20}> 
          <CardSet codeData={weekWeatherCodes} selectedCard={selectedCard} setSelectedCard={setSelectedCard} dailyEnergyData={dailyEnergyData}/>
        <Divider pb={10} />
        
        <Grid templateRows="repeat(5, 1fr)" templateColumns='repeat(12, 1fr)' gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }} my={10}>
          <GridItem rowSpan={1} colSpan={12} h="100%" pr={2} overflowX="auto">
            <HStack gap={4} w="100%">
              <DayEnergyCard energyDataName={"prod"} dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
              </DayEnergyCard>

              <DayEnergyCard energyDataName={"cons"} dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
              </DayEnergyCard>

              <DayNetEnergyCard dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
              </DayNetEnergyCard>
            </HStack>
          </GridItem >
          
          <GridItem rowSpan={1} colSpan={8} h="100%" pr={2} overflowX="auto">
            {weatherData && (<Insights data={weatherData} isWeekly={false} selectedCard={selectedCard} />)}
          </GridItem>

          {/* <GridItem rowStart={2} rowEnd={5} colStart={9} colEnd={13} maxH="100%" pr={2} >
            <GaugeSet data={conditionOfDay} ></GaugeSet>
          </GridItem> */}

          <GridItem rowStart={2} rowEnd={2} colStart={9} colEnd={13} maxH="100%" pr={2} >
            <GaugeCard
            data={conditionOfDay}
            attribute="shortwave_radiation"
            inverse
            labels={{
              low: { limit: 90, label: "Poor" },
              medium: { label: "Moderate" },
              high: { limit: 170, label: "Excellent" },
              minimum: 0,
              maximum: 250,
            }}
            />
          </GridItem>

          <GridItem rowStart={3} rowEnd={3} colStart={9} colEnd={13} maxH="100%" pr={2}>
            <GaugeCard
            data={conditionOfDay}
            attribute="daylight_hours"
            inverse
            labels={{
              low: { limit: 10, label: "Poor" },
              medium: { label: "Moderate" },
              high: { limit: 13, label: "Excellent" },
              minimum: 5,
              maximum: 18,
            }}
            />
          </GridItem>

          <GridItem rowStart={4} rowEnd={4} colStart={9} colEnd={13} maxH="100%" pr={2}>
          <GaugeCard
          data={conditionOfDay}
          attribute="cloud_cover"
          labels={{
            low: { limit: 40, label: "Excellent" },
            medium: { label: "Moderate" },
            high: { limit: 65, label: "Poor" },
            minimum: 0,
            maximum: 100,
          }}
          />
          </GridItem>

          <GridItem rowStart={5} rowEnd={5} colStart={9} colEnd={13} maxH="100%" pr={2}>
            <GaugeCard
            data={conditionOfDay}
            attribute="temperature_2m"
            labels={{
              low: { limit: 25, label: "Excellent" },
              medium: { label: "Moderate" },
              high: { limit: 35, label: "Poor" },
              minimum: 0,
              maximum: 45,
            }}
            />
          </GridItem>

          <GridItem rowSpan={3} colSpan={8} h="100%" pr={2} overflowX="auto">
            <Graph
              hourlyWeatherData={weatherData}
              hourlyEnergyData={energyData}
              indexDay={selectedCard} // you can make this variable based on the weather card
              schema={HOURLY_CONDITIONS}
            />
          </GridItem>        
        </Grid>
      {/* </AbsoluteCenter> */}
    </Box>
  );
}
