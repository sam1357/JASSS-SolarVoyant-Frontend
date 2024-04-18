"use client";

import { Box, Card, CardHeader, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { ConditionSelector } from "../Choropleth/ConditionSelector";
import {
  AverageDailyInWeekWeatherData,
  ConditionsSelectorData,
  DayConditions,
  energyDataObj,
  NextWeekHourlyData,
} from "@src/interfaces";
import { getAttributeName, getShortDate, getTime } from "./utils";
import { useEffect, useState } from "react";
import { FaSolarPanel, FaTemperatureEmpty } from "react-icons/fa6";
import { BsCloudsFill, BsSunFill } from "react-icons/bs";
import { SlEnergy } from "react-icons/sl";
import WeatherGraph from "./WeatherGraphs";
import { SECONDS_IN_HOUR } from "@src/constants";
import EnergyGraph from "./EnergyGraphs";

interface GraphProps {
  dailyWeatherData?: AverageDailyInWeekWeatherData;
  hourlyWeatherData?: NextWeekHourlyData;
  indexDay?: number; // which upcoming day you want it for
  weeklyEnergyData?: energyDataObj;
  hourlyEnergyData?: energyDataObj;
  schema: ConditionsSelectorData[];
}

export const DAILY_CONDITIONS: ConditionsSelectorData[] = [
  {
    label: "Temperature",
    unit: "°C",
    value: "temperature_2m",
    icon: <FaTemperatureEmpty />,
  },
  {
    label: "Solar Irradiance",
    unit: "MJ/m²",
    value: "shortwave_radiation",
    icon: <FaSolarPanel />,
  },
  {
    label: "Cloud Cover",
    unit: "%",
    value: "cloud_cover",
    icon: <BsCloudsFill />,
  },
  {
    label: "Sunshine Duration",
    unit: "hrs",
    value: "sunshine_hours",
    icon: <BsSunFill />,
  },
  {
    label: "Generation VS Consumption",
    unit: "W",
    value: "generation_consumption",
    icon: <SlEnergy />,
  },
];

export const HOURLY_CONDITIONS: ConditionsSelectorData[] = [
  {
    label: "Temperature",
    unit: "°C",
    value: "temperature_2m",
    icon: <FaTemperatureEmpty />,
  },
  {
    label: "Solar Irradiance",
    unit: "MJ/m²",
    value: "solar_radiation",
    icon: <FaSolarPanel />,
  },
  {
    label: "Cloud Cover",
    unit: "%",
    value: "cloud_cover",
    icon: <BsCloudsFill />,
  },
  {
    label: "Generation VS Consumption",
    unit: "W",
    value: "generation_consumption",
    icon: <SlEnergy />,
  },
];

const Graph: React.FC<GraphProps> = ({
  dailyWeatherData,
  hourlyWeatherData,
  indexDay,
  weeklyEnergyData,
  hourlyEnergyData,
  schema,
}) => {
  const [formattedWeatherData, setFormattedWeatherData] = useState<
    { date: string; value: number }[]
  >([]);
  const [formattedEnergyData, setFormattedEnergyData] = useState<
    { date: string; production: number; consumption: number }[]
  >([]);
  const [condition, setCondition] = useState<string>("generation_consumption");
  const { onClose } = useDisclosure();

  useEffect(() => {
    let dataValues: number[] = [];
    if (condition !== "generation_consumption") {
      if (dailyWeatherData) {
        dataValues = Object.values(dailyWeatherData)
          .map((values) => values[condition])
          .slice(0, -1); // Remove the last value
      } else if (hourlyWeatherData && indexDay !== undefined) {
        const day: DayConditions[] = hourlyWeatherData[indexDay];
        for (let i = 0; i < 24; i++) {
          if (day[i] && (day[i] as any)[condition] !== undefined) {
            dataValues.push((day[i] as any)[condition]);
          }
        }
      }
      const newData = dataValues.map((value, i) => {
        let adjustedValue = value;
        const conditionUnit = schema.find((item) => item.value === condition)?.unit;
        if (conditionUnit === "hrs") {
          adjustedValue /= SECONDS_IN_HOUR;
        }
        return {
          date: dailyWeatherData ? getShortDate(i) : getTime(i),
          value: adjustedValue,
        };
      });
      setFormattedWeatherData(newData);
    } else {
      let prodDataValues: number[] | undefined = [];
      let consDataValues: number[] | undefined = [];
      if (weeklyEnergyData) {
        prodDataValues = Object.values(weeklyEnergyData.production).map((values) => values.value);
        consDataValues = Object.values(weeklyEnergyData.consumption).map((values) => values.value);
      } else if (hourlyEnergyData && indexDay !== undefined) {
        const start = 24 * indexDay;
        const finish = start + 24;
        prodDataValues = Object.values(hourlyEnergyData.production)
          .map((values) => values.value)
          .slice(start, finish);
        consDataValues = Object.values(hourlyEnergyData.consumption)
          .map((values) => values.value)
          .slice(start, finish);
      }
      prodDataValues = prodDataValues.map((value) => parseFloat(value.toFixed(0)));
      consDataValues = consDataValues.map((value) => parseFloat(value.toFixed(0)));
      let newData = prodDataValues.map((prodValue, i) => ({
        date: weeklyEnergyData ? getShortDate(i) : getTime(i),
        production: prodValue,
        consumption: consDataValues[i],
      }));
      setFormattedEnergyData(newData);
    }
  }, [condition, indexDay]); // eslint-disable-line

  return (
    <Card borderRadius={"3xl"}>
      <CardHeader pb="0">
        <Flex padding={2} justifyContent={"space-between"}>
          <Heading fontSize={"3xl"} fontWeight="medium" size="md">
            {condition !== "generation_consumption"
              ? `${getAttributeName(condition)} (${
                  schema.find((item) => item.value === condition)?.unit
                }) over Time`
              : "Generation VS Consumption"}
          </Heading>
          <Box>
            <ConditionSelector
              selectedCondition={condition}
              setSelectedCondition={setCondition}
              onClose={onClose}
              schema={schema}
            />
          </Box>
        </Flex>
      </CardHeader>
      {condition !== "generation_consumption" ? (
        <WeatherGraph data={formattedWeatherData} />
      ) : (
        <EnergyGraph data={formattedEnergyData} />
      )}
    </Card>
  );
};

export default Graph;
