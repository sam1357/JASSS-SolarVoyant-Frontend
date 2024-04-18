
"use client";
import { Box, Divider, Grid, GridItem, HStack, useBreakpoint } from "@chakra-ui/react";
import {
  AverageDailyInWeekWeatherData,
  Conditions,
  NextWeekHourlyData,
  Units,
  WeekWeatherCodes,
  energyDataObj,
} from "@src/interfaces";
import CardSet from "@components/Dashboard/CardSet";
import Insights from "@components/Dashboard/Insights";
import { useEffect, useState } from "react";
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
  let gridHeight = ["md", "sm", "base"].includes(breakPoint) ? "9" : "5";
  return (
    <Box width={"100%"} padding={{ base: 5, sm: 10, md: 10, lg: 20, xl: 20, "2xl": 20 }
  }> 
          <CardSet codeData={weekWeatherCodes} selectedCard={selectedCard} setSelectedCard={setSelectedCard} dailyEnergyData={dailyEnergyData}/>
        <Divider pb={10} />
        
        <Grid templateRows={`repeat(${gridHeight}, 1fr)`} templateColumns='repeat(12, 1fr)' gap={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} my={10} width="100%">
          <GridItem rowSpan={1} colSpan={12} h="100%" pr={{ base: 0, sm: 0, md: 0, lg: 1, "2xl": 2 }} overflowX="auto">
            <HStack gap={4} w="100%">
              <DayEnergyCard energyDataName={"prod"} dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
              </DayEnergyCard>
              <DayEnergyCard energyDataName={"cons"} dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
              </DayEnergyCard>
              <DayNetEnergyCard dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
              </DayNetEnergyCard>
            </HStack>
          </GridItem>
          
          <GridItem rowSpan={4} colSpan={{ base: 12, lg: 8 }} h="100%" pr={{ base: 0, md: 1, xl: 2 }} overflowX="auto">
            <Grid templateRows="repeat(4, 1fr)" templateColumns='repeat(8, 1fr)' gap={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}>
              <GridItem rowSpan={1} colSpan={{ base: 12, lg: 8 }}>
                {weatherData && (<Insights data={weatherData} isWeekly={false} selectedCard={selectedCard} />)}
              </GridItem>
              <GridItem rowSpan={3} colSpan={{ base: 12, lg: 8 }} height={["md", "sm", "base"].includes(breakPoint) ? "50%" : "100%"}>
                <Graph
                hourlyWeatherData={weatherData}
                hourlyEnergyData={energyData}
                indexDay={selectedCard} // you can make this variable based on the weather card
                schema={HOURLY_CONDITIONS}
                />
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem rowStart={2} rowEnd={2} colStart={{ base: 0, lg: 9 }} colEnd={13} maxH="100%" pr={2}>
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
          <GridItem rowStart={3} rowEnd={3} colStart={{ base: 0, lg: 9 }} colEnd={13} maxH="100%" pr={2}>
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
          <GridItem rowStart={4} rowEnd={4} colStart={{ base: 0, lg: 9 }} colEnd={13} maxH="100%" pr={2}>
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
          <GridItem rowStart={5} rowEnd={5} colStart={{ base: 0, lg: 9 }} colEnd={13} maxH="100%" pr={2}>
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
        </Grid>
    </Box>
  );
}
