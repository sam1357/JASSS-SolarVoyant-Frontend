import { NextWeekHourlyData, WeekWeatherCodes, energyDataObj } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";

export default async function ForecastPage() {
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek("Kensington");
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek("Kensington");
  const session = await getServerSession(authOptions);
  console.log(session?.user?.id as string);

  const res = await Api.getEnergyDataOfWeek(session?.user?.id as string, "week");
  console.log(res);

  // Get Insights Data
  let insightData: NextWeekHourlyData | undefined = undefined;
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false, "Kensington");
    store.dispatch(setInsightData(insightData));
  }
  
  // Get Week Weather Codes
  const weekWeatherCodes: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek("Kensington"); // FIXME: change hardcode

  // Get Energy Data for Forecast Cards
  let dailyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "day");

  // DEBUGGING
  // let user = await getAllDataOfUser(session?.user.id);
  // console.log("BEFORE USER:");
  // console.log(user);

  // const res = await Api.getEnergyDataOfWeek(session?.user.id, "week");
  // console.log("RES: ");
  // console.log(res);

  // console.log("AFTER USER:");
  // console.log(user);
  
  return (
    <ForecastPageClient
      result={result}
      insightData={insightData}
      averageConditions={averageConditionsOfWeek}
      weekWeatherCodes={weekWeatherCodes} 
      dailyEnergyData={dailyEnergyData}
    />
  );
}
