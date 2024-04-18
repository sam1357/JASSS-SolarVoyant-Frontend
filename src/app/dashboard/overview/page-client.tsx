"use client";

import { Box, Flex, Grid, GridItem, Heading, Stack, useBreakpoint, VStack } from "@chakra-ui/react";
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
  const breakpoint = useBreakpoint();
  return (
    <Box width={"100%"} padding={5}>
      <Box paddingStart={5} paddingBottom={5}>
        <Heading fontSize={"4xl"}>Welcome, {session?.user?.name}! 👋</Heading>
      </Box>
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }}
      >
        <GridItem pr={2} overflowY="scroll" colSpan={{ base: 3, lg: 2 }}>
          <Stack
            w="100%"
            direction={["md", "sm", "base"].includes(breakpoint) ? "column" : "row"}
            height={["md", "sm", "base"].includes(breakpoint) ? "column" : "row"}
            paddingTop={["md", "sm", "base"].includes(breakpoint) ? 2 : 0}
            gap={6}
          >
            <Box
              minW="300px"
              w={{ base: "100%", lg: "50%" }}
              height={"100%"}
              verticalAlign={"center"}
            >
              {insightsData && <Insights data={insightsData} isWeekly={true} selectedCard={0} />}
            </Box>
            <Box
              borderRadius="3xl"
              minW="250px"
              paddingTop={["md", "sm", "base"].includes(breakpoint) ? 4 : 0}
              w={{ base: "100%", lg: "50%" }}
            >
              <StatsCard data={statsCardData} />
            </Box>
          </Stack>
          <Box borderRadius="3xl" paddingTop={["md", "sm", "base"].includes(breakpoint) ? 10 : 6}>
            <Graph
              weeklyEnergyData={weeklyEnergyData}
              dailyWeatherData={weeklyOverviewGraphData}
              schema={DAILY_CONDITIONS}
            ></Graph>
          </Box>
        </GridItem>
        <GridItem colSpan={{ base: 3, lg: 1 }}>
          <Stack gap={6} minW="300px" direction="column">
            <Box width={"100%"}>
              <WeekEnergyCard energyDataName="net" weekEnergyData={energyCardsData} />
            </Box>
            <Box width={"100%"} paddingTop={["md", "sm", "base"].includes(breakpoint) ? 4 : 0}>
              <WeekEnergyCard energyDataName="prod" weekEnergyData={energyCardsData} />
            </Box>
            <Box width={"100%"} paddingTop={["md", "sm", "base"].includes(breakpoint) ? 4 : 0}>
              <WeekEnergyCard energyDataName="cons" weekEnergyData={energyCardsData} />
            </Box>
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  );
}

{
  /* <GridItem>
  
</GridItem>; */
}
