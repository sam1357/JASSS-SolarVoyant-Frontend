"use client";
import { Flex } from "@chakra-ui/react";
import WeatherCard from "./WeatherCard";
import { WeekWeatherCodes } from "@src/interfaces";
// import { DashboardData } from "@interfaces/index";

interface CardSetProps {
  data: WeekWeatherCodes;
}

const CardSet: React.FC<CardSetProps> = ({ data }) => {
  return (
    <Flex justifyContent="space-between">
      {Array.from({ length: 7 }, (_, index) => (
        <WeatherCard key={index} index={index} data={data} />
      ))}
    </Flex>
  );
};
export default CardSet;
