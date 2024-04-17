import { NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";

export default async function ForecastPage() {
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek();
  let insightData: NextWeekHourlyData | undefined = undefined;
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek();

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false);
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
