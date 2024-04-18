import { Box, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { AverageDailyInWeekWeatherData, currentWeatherData, energyDataObj } from "@src/interfaces";
import { Api } from "@utils/Api";
import StatsCard from "@components/Dashboard/StatsCard";
import store, { setInsightData } from "@src/store";
import Graph, { DAILY_CONDITIONS } from "@components/Dashboard/Graph";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // FIXME: change suburbs to user suburb
  const statsCardData: currentWeatherData = await Api.getCurrentWeatherData("Kensington");
  const weeklyOverviewGraphData: AverageDailyInWeekWeatherData =
    await Api.getDailyAverageConditionsDataOfWeek("Kensington");
  const weeklyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "day");

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    let insightData = await Api.getWeekWeatherData(false, "Kensington");
    store.dispatch(setInsightData(insightData));
  }

  // TODO: Still working on organising this, setup below is just to show how to pass data
  return (
    <>
      <Box paddingStart={5}>
        <Heading>Welcome, {session?.user?.name}! 👋</Heading>
      </Box>
      <Box width={"20%"} padding={5}>
        <StatsCard data={statsCardData}></StatsCard>
      </Box>
      <Box padding={5} borderRadius="3xl">
        <Graph
          dailyWeatherData={weeklyOverviewGraphData}
          weeklyEnergyData={weeklyEnergyData}
          schema={DAILY_CONDITIONS}
        ></Graph>
      </Box>
    </>
  );
}
