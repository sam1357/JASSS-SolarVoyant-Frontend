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
import { getAllDataOfUser } from "@src/utils/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const suburb: string = (await getAllDataOfUser(session?.user?.id)).suburb;
  const statsCardData: currentWeatherData = await Api.getCurrentWeatherData(suburb);
  const weeklyOverviewGraphData: AverageDailyInWeekWeatherData =
    await Api.getDailyAverageConditionsDataOfWeek(suburb);
  const weeklyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "day");
  const singleDayData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "week");
  let insightData: NextWeekHourlyData | undefined;

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false, suburb);
    store.dispatch(setInsightData(insightData));
  }

  return (
    <OverviewPageClient
      session={session}
      statsCardData={statsCardData}
      weeklyEnergyData={weeklyEnergyData}
      weeklyOverviewGraphData={weeklyOverviewGraphData}
      energyCardsData={singleDayData}
      insightsData={insightData}
    />
  );
}
