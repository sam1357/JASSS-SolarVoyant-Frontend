import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { NextWeekHourlyData, WeekWeatherCodes, energyDataObj } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";
import ForecastPageClient from "@app/dashboard/forecast/page-client";
import { getAllDataOfUser } from "@src/utils/utils";

export default async function ForecastPage() {
  const session = await getServerSession(authOptions);
  
  // Get Insights Data
  let insightData: NextWeekHourlyData | undefined = undefined;
  if (Object.keys(store.getState().insightData).length === 0) {
    insightData = await Api.getWeekWeatherData(false, "Kensington"); // FIXME: change hardcode
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
  
  return <ForecastPageClient weekWeatherCodes={weekWeatherCodes} dailyEnergyData={dailyEnergyData} />;
}
