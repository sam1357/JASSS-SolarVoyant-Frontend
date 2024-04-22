import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import {
  AverageDailyInWeekWeatherData,
  currentWeatherData,
  energyDataObj,
  NextWeekHourlyData,
} from "@src/interfaces";
import { Api } from "@utils/Api";
import OverviewPageClient from "./page-client";
import { getAllDataOfUser } from "@src/utils/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Fetching data for the user
  const suburb: string = (await getAllDataOfUser(session?.user?.id)).suburb;

  // Fetching data for the dashboard
  const statsCardData: currentWeatherData = await Api.getCurrentWeatherData(suburb);
  const weeklyOverviewGraphData: AverageDailyInWeekWeatherData =
    await Api.getDailyAverageConditionsDataOfWeek(suburb);
  const weeklyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "day");
  const singleDayData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "week");
  const insightData: NextWeekHourlyData = await Api.getWeekWeatherData(true, suburb);

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
