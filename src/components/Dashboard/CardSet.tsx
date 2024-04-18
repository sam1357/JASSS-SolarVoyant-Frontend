import React from "react";
import { HStack } from "@chakra-ui/react";
import WeatherCard from "@components/Dashboard/WeatherCard";
import { WeekWeatherCodes } from "@src/interfaces";

interface CardSetProps {
  data?: WeekWeatherCodes;
  selectedCard: number;
  setSelectedCard: (index: number) => void; // eslint-disable-line
}

const CardSet: React.FC<CardSetProps> = ({ data, selectedCard, setSelectedCard }) => {
  return (
    data && (
      <HStack justifyContent={{ lg: "left", xl: "center" }} overflowX="scroll" width="100%" gap={3}>
        {Array.from({ length: 7 }, (_, index) => (
          <WeatherCard
            key={index}
            index={index}
            data={data}
            isActive={selectedCard === index}
            onClick={() => setSelectedCard(index)}
          />
        ))}
      </HStack>
    )
  );
};
export default CardSet;
