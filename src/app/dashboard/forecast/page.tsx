import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { energyDataObj, NextWeekHourlyData, WeekWeatherCodes } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";
import { getAllDataOfUser } from "@src/utils/utils";

export default async function ForecastPage() {
  // Get Key User Data
  const session = await getServerSession(authOptions);
  let userId = session?.user?.id;
  let userSuburb: string = (await getAllDataOfUser(userId)).suburb;

  // Get Insights Data
  let insightData: NextWeekHourlyData | undefined = undefined;
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(true, userSuburb);
    store.dispatch(setInsightData(insightData));
  }
  
  // Get Week Weather Codes
  const weekWeatherCodes: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek(userSuburb); 
  
  // Get Energy Data for Forecast Cards
  const dailyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(userId, "day");

  // Get Weather data for gauge cards
  const averageConditionsOfWeek = await Api.getDailyAverageConditionsDataOfWeek(userSuburb);

  // Get Energy Data for Graph
  const hourlyEnergyData: energyDataObj = await Api.getEnergyDataOfWeek(userId, "hour");

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
