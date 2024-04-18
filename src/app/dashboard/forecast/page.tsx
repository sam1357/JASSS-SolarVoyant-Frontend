import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";
import { getAllDataOfUser } from "@src/utils/utils";

export default async function ForecastPage() {
  const session = await getServerSession(authOptions);
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek();
  let insightData: NextWeekHourlyData | undefined = undefined;
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek();

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false);
    store.dispatch(setInsightData(insightData));
  }

    // (2) Call getEnergyDataOfWeek
    let user = await getAllDataOfUser(session?.user.id);
    console.log("BEFORE USER:");
    console.log(user);

    const res = await Api.getEnergyDataOfWeek(session?.user.id, "week");
    console.log("RES: ");
    console.log(res);
    
    console.log("AFTER USER:");
    console.log(user);
  return (
    <ForecastPageClient
      result={result} energyData={res}
    />
  );
}