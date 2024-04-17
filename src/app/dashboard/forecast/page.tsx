import { Box, Card, CardBody, CardHeader, Center, Divider, Heading } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@src/authOptions";
import { NextWeekHourlyData, WeekWeatherCodes, currentWeatherData } from "@src/interfaces";
import { Api } from "@utils/Api";
import store, { setInsightData } from "@src/store";

// import StatsCard from "@components/Dashboard/StatsCard";
import CardSet from "@src/components/Dashboard/CardSet";
import Graph, { HOURLY_CONDITIONS } from "@src/components/Dashboard/Graph";

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
      <Center>
        <Box width={"65%"} padding={5}>
          <CardSet data={result}></CardSet>
        </Box>
      </Center>
      <Center>
        <Divider width={"65%"} orientation="horizontal" />
      </Center>
      <Box padding={5} borderRadius="3xl">
        <Graph
          hourlyWeatherData={result2}
          indexDay={0} // you can make this variable based on the weather card
          schema={HOURLY_CONDITIONS}
        ></Graph>
      </Box>
    </>
  );
}
