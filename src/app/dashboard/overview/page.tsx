import { Box, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { AverageDailyInWeekWeatherData, currentWeatherData } from "@src/interfaces";
import { Api } from "@utils/Api";
import StatsCard from "@components/Dashboard/StatsCard";
import store, { setInsightData } from "@src/store";
import OverviewPageClient from "./page-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const statsCardData: currentWeatherData = await Api.getCurrentWeatherData();
  const weeklyOverviewGraphData: AverageDailyInWeekWeatherData =
    await Api.getDailyAverageConditionsDataOfWeek();

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    let insightData = await Api.getInsightDataOfWeek();
    store.dispatch(setInsightData(insightData));
  }
  const insightData = store.getState().insightData;

  // TODO: Still working on organising this, setup below is just to show how to pass data
  return (
    <>
      <OverviewPageClient
        session={session}
        statsCardData={statsCardData}
        weeklyOverviewGraphData={weeklyOverviewGraphData}
      />
    </>
  );
}
