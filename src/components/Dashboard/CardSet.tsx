"use client";
import { Flex } from "@chakra-ui/react";
import WeatherCard from "./WeatherCard";
import { DashboardData } from "@interfaces/index";

interface CardSetProps {
  data: DashboardData;
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
