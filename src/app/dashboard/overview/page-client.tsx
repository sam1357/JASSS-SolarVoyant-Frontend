"use client";

import { Box, Flex, Grid, GridItem, Heading, HStack, VStack } from "@chakra-ui/react";
import Graph, { DAILY_CONDITIONS } from "@components/Dashboard/Graph";
import StatsCard from "@components/Dashboard/StatsCard";
import Insights from "@src/components/Dashboard/Insights";
import WeekEnergyCard from "@src/components/Dashboard/WeekEnergyCard";
import {
  AverageDailyInWeekWeatherData,
  currentWeatherData,
  energyDataObj,
  NextWeekHourlyData,
  Session,
} from "@src/interfaces";

interface OverviewPageClientProps {
  session: Session;
  statsCardData: currentWeatherData;
  weeklyOverviewGraphData: AverageDailyInWeekWeatherData;
  weeklyEnergyData: energyDataObj;
  insightsData: NextWeekHourlyData | undefined;
  energyCardsData: energyDataObj;
}

export default function OverviewPageClient({
  session,
  statsCardData,
  weeklyEnergyData,
  weeklyOverviewGraphData,
  insightsData,
  energyCardsData,
}: OverviewPageClientProps) {
  console.log(weeklyEnergyData);
  return (
    <Box width={"100%"} padding={5}>
      <Box paddingStart={5} paddingBottom={5}>
        <Heading fontSize={"4xl"}>Welcome, {session?.user?.name}! 👋</Heading>
      </Box>
      <Grid templateRows="repeat(3, 1fr)" gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }}>
        <GridItem rowSpan={1} h="100%" pr={2} overflowX="scroll">
          <HStack gap={6} w="100%" paddingTop={5}>
            <Box width={"50%"}>
              {insightsData && <Insights data={insightsData} isWeekly={true} selectedCard={0} />}
            </Box>
            <Box borderRadius="3xl" h="300px" minW="200px" w="20%">
              <StatsCard data={statsCardData} />
            </Box>
            <Box borderRadius="3xl" h="300px" minW="200px" w="30%" paddingTop={12}>
              <WeekEnergyCard energyDataName="net" weekEnergyData={energyCardsData} />
            </Box>
          </HStack>
        </GridItem>
        <GridItem rowSpan={4}>
          <Flex>
            <Box padding={2} borderRadius="3xl" width="70%" h="600px" paddingTop={4}>
              <Graph
                weeklyEnergyData={weeklyEnergyData}
                dailyWeatherData={weeklyOverviewGraphData}
                schema={DAILY_CONDITIONS}
              ></Graph>
            </Box>
            <VStack gap={6} paddingTop={3} paddingLeft={5} width={"30%"}>
              <Box width={"100%"}>
                <WeekEnergyCard energyDataName="prod" weekEnergyData={energyCardsData} />
              </Box>
              <Box width={"100%"}>
                <WeekEnergyCard energyDataName="cons" weekEnergyData={energyCardsData} />
              </Box>
            </VStack>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}
