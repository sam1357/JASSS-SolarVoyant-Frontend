"use client";

import {
  Card,
  CardBody,
  Heading,
  CardHeader,
  HStack,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import {
  LOW_PRECIP_THRESHOLD,
  SEVERE_WEATHER_THRESHOLD,
  TIMEFRAME_THRESHOLD,
} from "@src/constants";
import {
  HourlyConditions,
  InsightProcessedData,
  NextWeekHourlyData,
  Timeframes,
} from "@src/interfaces";
import { generateInsightsDaily, generateInsightsWeekly } from "@utils/utils";
import { HiLightBulb } from "react-icons/hi";

interface InsightsProps {
  data: NextWeekHourlyData | {};
  isWeekly: boolean;
  selectedCard: number;
}

// Add index to each item in the array
const addIndex = (array: any) => {
  return array.map((item: any, index: number) => {
    return { ...item, index };
  });
};

// Get hours with low precipitation
const getLowPrecipHours = (hourlyData: HourlyConditions[]) => {
  return hourlyData
    .filter((hour: any) => hour.precipitation_probability < LOW_PRECIP_THRESHOLD)
    .map((hour: any) => hour.index);
};

// Process daily data
const processDailyData = (data: NextWeekHourlyData, selectedDay: number): InsightProcessedData => {
  const hourlyData = addIndex(Object.values(data[selectedDay]));

  // get hours with severe weather, and return their indices
  const severeWeather = hourlyData
    .filter((hour: any) => hour.weather_code >= SEVERE_WEATHER_THRESHOLD)
    .map((hour: any) => hour.index);
  const lowPrecipitation = getLowPrecipHours(hourlyData.slice(7, 23) as any);
  const fullLowPrecipHours = getLowPrecipHours(hourlyData as any);

  // look for timeframes with low precipitation, which are periods of 4 hours or more
  const timeFrame: Timeframes[] = [];
  let start = 0;
  let end = 0;
  // loop through the array of hours with low precipitation
  for (let i = 0; i < fullLowPrecipHours.length; i++) {
    if (fullLowPrecipHours[i] - fullLowPrecipHours[i - 1] === 1) {
      end = i;
    } else {
      if (end - start >= TIMEFRAME_THRESHOLD) {
        timeFrame.push({ start, end });
      }
      start = i;
      end = i;
    }
  }

  return {
    severeWeather,
    lowPrecipitation,
    timeFrame,
  };
};

const processWeeklyData = (data: NextWeekHourlyData): InsightProcessedData => {
  const severeWeather: number[] = [];
  const lowPrecipitation: number[] = [];

  // get index of days with severe weather
  for (let i = 0; i < Object.keys(data).length - 1; i++) {
    const hourlyData = addIndex(Object.values(data[i]));
    const severeWeatherData = hourlyData.filter(
      (hour: any) => hour.weather_code >= SEVERE_WEATHER_THRESHOLD
    );

    // get index of days with severe weather
    if (severeWeatherData.length > 0) {
      severeWeather.push(i);
    }

    // get index of days with low precipitation
    const lowPrecipHours = getLowPrecipHours(hourlyData.slice(7, 23) as any);
    if (lowPrecipHours.length >= 2) {
      lowPrecipitation.push(i);
    }
  }

  return {
    severeWeather,
    lowPrecipitation,
  };
};

// Insights component
const Insights: React.FC<InsightsProps> = ({ data, isWeekly, selectedCard }) => {
  // Format the insights based on the data
  const format = isWeekly ? "Weekly" : "Daily";
  let insights: string[] = [];

  // Process the data and generate insights
  if (!isWeekly) {
    const processedInsights: InsightProcessedData = processDailyData(
      data as NextWeekHourlyData,
      selectedCard
    );
    // Generate insights based on the processed data
    insights = generateInsightsDaily(processedInsights);
  } else {
    // Process the data and generate insights
    const processedInsights: InsightProcessedData = processWeeklyData(data as NextWeekHourlyData);
    insights = generateInsightsWeekly(processedInsights);
  }

  return (
    <Card borderRadius="3xl" p={2} padding={isWeekly ? 4 : 0} h="100%">
      <CardHeader>
        <HStack>
          <Heading as="h2" size="lg">
            {format} Insights
          </Heading>
          <HiLightBulb size="2em" />
        </HStack>
      </CardHeader>
      <CardBody>
        <UnorderedList>
          {insights && insights.map((insight, index) => <ListItem key={index}>{insight}</ListItem>)}
        </UnorderedList>
      </CardBody>
    </Card>
  );
};

export default Insights;
