"use client";

import {
  Box,
  Card,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import Graph, { DAILY_CONDITIONS } from "@components/Dashboard/Graph";
import StatsCard from "@components/Dashboard/StatsCard";
import { AverageDailyInWeekWeatherData, currentWeatherData, Session } from "@src/interfaces";

interface OverviewPageClientProps {
  session: Session;
  statsCardData: currentWeatherData;
  weeklyOverviewGraphData: AverageDailyInWeekWeatherData;
}

export default function OverviewPageClient({
  session,
  statsCardData,
  weeklyOverviewGraphData,
}: OverviewPageClientProps) {
  return (
    <Box width={"100%"} padding={5}>
      <Box paddingStart={5} paddingBottom={5}>
        <Heading fontSize={"4xl"}>Welcome, {session?.user?.name}! 👋</Heading>
      </Box>
      <Grid templateRows="repeat(3, 1fr)" gap={{ base: 10, sm: 10, md: 10, lg: 10, xl: 6 }}>
        <GridItem rowSpan={1} h="100%" pr={2} overflowX="scroll">
          <HStack gap={6} w="100%" paddingTop={5}>
            <Card borderRadius="3xl" h="300px" minW="200px" w="50%" />
            <Box borderRadius="3xl" h="300px" minW="200px" w="20%">
              <StatsCard data={statsCardData} />
            </Box>
            <Card borderRadius="3xl" h="300px" minW="200px" w="30%" />
          </HStack>
        </GridItem>
        <GridItem rowSpan={4}>
          <Flex>
            <Box padding={2} borderRadius="3xl" width="70%" h="600px" paddingTop={4}>
              <Graph dailyWeatherData={weeklyOverviewGraphData} schema={DAILY_CONDITIONS}></Graph>
            </Box>
            <VStack gap={6} paddingTop={3} paddingLeft={5} width={"29%"}>
              <Card borderRadius="3xl" h="200px" minW="200px" w="100%" />
              <Card borderRadius="3xl" h="200px" minW="200px" w="100%" />
            </VStack>
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}
