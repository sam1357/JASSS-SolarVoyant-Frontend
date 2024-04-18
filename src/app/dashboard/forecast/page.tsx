import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { energyDataObj, NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";

export default async function ForecastPage() {
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek("Kensington");
  const session = await getServerSession(authOptions);
  const hourlyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(session?.user?.id, "hour");
  
  // Get Insights Data
  let insightData: NextWeekHourlyData | undefined = undefined;
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(true, "Kensington");
    store.dispatch(setInsightData(insightData));
  }
  
  // Get Week Weather Codes
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek("Kensington");
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
      weatherData={insightData}
      energyData={hourlyEnergyData}
      averageConditions={averageConditionsOfWeek}
      weekWeatherCodes={weekWeatherCodes} 
      dailyEnergyData={dailyEnergyData}
    />
  );
}
