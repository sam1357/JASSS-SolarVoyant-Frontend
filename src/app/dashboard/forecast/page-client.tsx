"use client";

import { Box, Card, Divider, Flex, Grid, GridItem, HStack } from "@chakra-ui/react";
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
import { AreaChart } from "@saas-ui/charts";
import DayEnergyCard from "@src/components/Dashboard/DayEnergyCard";
import DayNetEnergyCard from "@src/components/Dashboard/DayNetEnergyCard";

interface ForecastPageClientProps {
  result: WeekWeatherCodes;
  insightData?: NextWeekHourlyData;
  averageConditions: AverageDailyInWeekWeatherData;
  weekWeatherCodes: WeekWeatherCodes;
  dailyEnergyData: energyDataObj;
}

export default function ForecastPageClient({
  result,
  insightData,
  averageConditions,
  weekWeatherCodes, 
  dailyEnergyData
}: ForecastPageClientProps) {
  const [selectedCard, setSelectedCard] = useState<number>(0); // INDEX
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
          <HStack gap={2} w="100%">
            
            <DayEnergyCard energyDataName={"prod"} dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
            </DayEnergyCard>

            <DayEnergyCard energyDataName={"cons"} dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
            </DayEnergyCard>

            <DayNetEnergyCard dailyEnergyData={dailyEnergyData} dayIndex={selectedCard}>
            </DayNetEnergyCard>

            {/* <Card borderRadius="3xl" h="200px" minW="200px" w="25%" />
            <Card borderRadius="3xl" h="200px" minW="200px" w="25%" />
            <Card borderRadius="3xl" h="200px" minW="200px" w="50%" /> */}
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
                  {insightData && (
                    <Insights data={insightData} isWeekly={false} selectedCard={selectedCard} />
                  )}
                </GridItem>
                <GridItem rowSpan={2}>
                  <AreaChart
                    data={data}
                    categories={["Revenue"]}
                    valueFormatter={valueFormatter}
                    yAxisWidth={80}
                    height="400px"
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

const valueFormatter = (value: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const data = [
  {
    date: "Jan 1",
    Revenue: 1475,
  },
  {
    date: "Jan 8",
    Revenue: 1936,
  },
  {
    date: "Jan 15",
    Revenue: 1555,
  },
  {
    date: "Jan 22",
    Revenue: 1557,
  },
  {
    date: "Jan 29",
    Revenue: 1977,
  },
  {
    date: "Feb 5",
    Revenue: 2315,
  },
  {
    date: "Feb 12",
    Revenue: 1736,
  },
  {
    date: "Feb 19",
    Revenue: 1981,
  },
  {
    date: "Feb 26",
    Revenue: 2581,
  },
  {
    date: "Mar 5",
    Revenue: 2592,
  },
  {
    date: "Mar 12",
    Revenue: 2635,
  },
  {
    date: "Mar 19",
    Revenue: 2074,
  },
  {
    date: "Mar 26",
    Revenue: 2984,
  },
  {
    date: "Apr 2",
    Revenue: 2254,
  },
  {
    date: "Apr 9",
    Revenue: 3159,
  },
  {
    date: "Apr 16",
    Revenue: 2804,
  },
  {
    date: "Apr 23",
    Revenue: 2602,
  },
  {
    date: "Apr 30",
    Revenue: 2840,
  },
  {
    date: "May 7",
    Revenue: 3299,
  },
  {
    date: "May 14",
    Revenue: 3487,
  },
  {
    date: "May 21",
    Revenue: 3439,
  },
  {
    date: "May 28",
    Revenue: 3095,
  },
  {
    date: "Jun 4",
    Revenue: 3252,
  },
  {
    date: "Jun 11",
    Revenue: 4096,
  },
  {
    date: "Jun 18",
    Revenue: 4193,
  },
  {
    date: "Jun 25",
    Revenue: 4759,
  },
];
