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
      <WeatherCard index={0} data={data}></WeatherCard>
      <WeatherCard index={1} data={data}></WeatherCard>
      <WeatherCard index={2} data={data}></WeatherCard>
      <WeatherCard index={3} data={data}></WeatherCard>
      <WeatherCard index={4} data={data}></WeatherCard>
      <WeatherCard index={5} data={data}></WeatherCard>
      <WeatherCard index={6} data={data}></WeatherCard>
    </Flex>
  );
};
export default CardSet;
