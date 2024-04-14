import { Box, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { currentWeatherData } from "@src/interfaces";
import { Api } from "@utils/Api";
import StatsCard from "@components/Dashboard/StatsCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const statsCardData: currentWeatherData = await Api.getCurrentWeatherData();

  // TODO: Still working on organising this, setup below is just to show how to pass data
  return (
    <>
      <Box paddingStart={5}>
        <Heading>Welcome, {session?.user?.name}! 👋</Heading>
      </Box>
      <Box width={"20%"} padding={5}>
        <StatsCard data={statsCardData}></StatsCard>
      </Box>
    </>
  );
}
