import { NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export default async function ForecastPage() {
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek("Kensington");
  let insightData: NextWeekHourlyData | undefined = undefined;
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek("Kensington");
  const session = await getServerSession(authOptions);
  console.log(session?.user?.id as string);

  const res = await Api.getEnergyDataOfWeek(session?.user?.id as string, "week");
  console.log(res);

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false, "Kensington");
    store.dispatch(setInsightData(insightData));
  }

  return (
    <ForecastPageClient
      result={result}
      insightData={insightData}
      averageConditions={averageConditionsOfWeek}
    />
  );
}
