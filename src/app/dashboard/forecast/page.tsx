import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { energyDataObj, NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";

export default async function ForecastPage() {
  const session = await getServerSession(authOptions);
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek("Kensington");
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek("Kensington");
  let insightData: NextWeekHourlyData | undefined;
  const dailyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "hour");

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(true, "Kensington");
    store.dispatch(setInsightData(insightData));
  }

  return (
    <ForecastPageClient
      result={result}
      weatherData={insightData}
      energyData={dailyEnergyData}
      averageConditions={averageConditionsOfWeek}
    />
  );
}
