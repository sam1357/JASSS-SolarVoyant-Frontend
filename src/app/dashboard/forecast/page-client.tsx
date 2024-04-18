"use client";

import { Box, Center, Divider } from "@chakra-ui/react";
import { WeekWeatherCodes } from "@src/interfaces";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@src/components/Dashboard/CardSet";

interface ForecastPageClientProps {
    result: WeekWeatherCodes;
    energyData: any;
}

export default function ForecastPageClient({result, energyData}: ForecastPageClientProps) {
  // TEST getEnergyDataOfWeek
  //// (1) Set up User
  let userId = "df20e936-7431-4046-aafd-3df3d974df75";
  let setUserData = {
    suburb: "Panania",
    surface_area: "42",
    quarterly_energy_consumption: "1337, 1952, 1223, 1384",
    q1_w: "1332",
    q2_w: "1946",
    q3_w: "1223",
    q4_w: "1214",
  };

  // await Api.setUserData("df20e936-7431-4046-aafd-3df3d974df75", setUserData);
  
  // (2) Call getEnergyDataOfWeek
  // console.log(await Api.getEnergyDataOfWeek(session?.user));

  // TODO: Still working on organising this, setup below is just to show how to pass data
  return (
    <>
      <Center>
        <Box width={"65%"} padding={5}>
          <CardSet data={result}></CardSet>
        </Box>
      </Center>
      <Center>
        <Divider width={"65%"} orientation='horizontal' />
      </Center>
    </>
  );
}