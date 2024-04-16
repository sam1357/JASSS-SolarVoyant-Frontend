import { Box, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { NextWeekHourlyData, WeekWeatherCodes, currentWeatherData } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@src/components/Dashboard/CardSet";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const result: WeekWeatherCodes = await Api.getWeatherCodeDataOfWeek();
  const result2: NextWeekHourlyData = await Api.getHourlyWeatherDataOfWeek();

  // Get Insights Data
  if (Object.keys(store.getState().insightData).length === 0) {
    let insightData = await Api.getInsightDataOfWeek();
    store.dispatch(setInsightData(insightData));
  }
  const insightData = store.getState().insightData;
  // console.log(insightData);

  // TODO: Still working on organising this, setup below is just to show how to pass data
  return (
    <>
      <Box width={"60%"} padding={5}>
        <CardSet data={result}></CardSet>
      </Box>
    </>
  );
}