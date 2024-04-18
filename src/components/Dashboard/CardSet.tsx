import React from "react";
import { HStack } from "@chakra-ui/react";
import WeatherCard from "@components/Dashboard/WeatherCard";
import { WeekWeatherCodes, energyDataObj, energyWithTimeStamp } from "@src/interfaces";

interface CardSetProps {
  codeData?: WeekWeatherCodes;
  selectedCard: number;
  setSelectedCard: (index: number) => void; // eslint-disable-line
  dailyEnergyData: energyDataObj;
}

const CardSet: React.FC<CardSetProps> = ({ codeData, selectedCard, setSelectedCard, dailyEnergyData }) => {
  // raw net energy
  let rawNetEnergyArray = dailyEnergyData.netRaw as energyWithTimeStamp[];
  let percNetEnergyArray = dailyEnergyData.net as energyWithTimeStamp[];

  return (
    codeData && (
      <HStack justifyContent={{ lg: "left", xl: "center" }} overflowX="auto" width="100%" height= "100%" gap={10}>
        {Array.from({ length: 7 }, (_, index) => (
          <WeatherCard
            key={index}
            index={index}
            codeData={codeData}
            rawNetEnergy={rawNetEnergyArray[index].value}
            percNetEnergy={percNetEnergyArray[index].value}
            isActive={selectedCard === index}
            onClick={() => setSelectedCard(index)}
          />
        ))}
      </HStack>
    )
  );
};
export default CardSet;
