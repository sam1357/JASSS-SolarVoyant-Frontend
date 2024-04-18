"use client";

import { Box, Center, Divider } from "@chakra-ui/react";
import { WeekWeatherCodes } from "@src/interfaces";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@src/components/Dashboard/CardSet";

interface ForecastPageClientProps {
  result: WeekWeatherCodes;
}

export default function ForecastPageClient({ result }: ForecastPageClientProps) {
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
    </>
  );
}
