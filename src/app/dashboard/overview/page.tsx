import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import {
  AverageDailyInWeekWeatherData,
  currentWeatherData,
  energyDataObj,
  NextWeekHourlyData,
} from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import OverviewPageClient from "./page-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // FIXME: change suburbs to user suburb
  const statsCardData: currentWeatherData = await Api.getCurrentWeatherData("Kensington");
  const weeklyOverviewGraphData: AverageDailyInWeekWeatherData =
    await Api.getDailyAverageConditionsDataOfWeek("Kensington");
  const weeklyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "day");
  let insightData: NextWeekHourlyData | undefined;

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false, "Kensington");
    store.dispatch(setInsightData(insightData));
  }

  return (
    <OverviewPageClient
      session={session}
      statsCardData={statsCardData}
      weeklyEnergyData={weeklyEnergyData}
      weeklyOverviewGraphData={weeklyOverviewGraphData}
      insightsData={insightData}
    />
  );
}
