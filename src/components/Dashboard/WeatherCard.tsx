"use client";
import { Card, CardBody, Box, Heading, Text, Image, Center } from "@chakra-ui/react";
import { WeekWeatherCodes } from "@interfaces/index";
import { getDayOfWeek } from "@components/Dashboard/utils";
import { useEffect, useState } from "react";

interface WeatherCardProps {
  index: number; // day of week
  codeData: WeekWeatherCodes;
  isActive: boolean;
  onClick: () => void;
  rawNetEnergy: number;
  percNetEnergy: number;
}

type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WeatherCard: React.FC<WeatherCardProps> = ({
  index,
  codeData,
  isActive,
  onClick,
  rawNetEnergy,
  percNetEnergy,
}) => {
  const [day, setDay] = useState("");

  useEffect(() => {
    // Get the name of the day of the week
    const getDay = () => {
      const dayOfWeek = getDayOfWeek(index);
      setDay(dayOfWeek);
    };
    getDay();
  }, []); // eslint-disable-line

  return (
    <Card
      borderRadius="3xl"
      _hover={{ bg: "primary.400", textColor: "white" }}
      _active={{ bg: "primary.500" }}
      bg={isActive ? "primary.500" : "whiteAlpha.200"}
      textColor={isActive ? "white" : "auto"}
      onClick={onClick}
      cursor="pointer"
      minW="140px"
      maxW="180px"
      w="100%"
    >
      <CardBody>
        <Heading fontSize="xl" textAlign="center">
          {day}
        </Heading>
        <Center>
          <Image
            src={codeData[index as Index].image}
            alt="Weather image"
            style={{ maxWidth: "100%" }}
            marginBottom={-2}
            marginTop={-2}
          />
        </Center>
        <Box>
          <Text fontSize="md" textAlign="center">
            {percNetEnergy.toFixed(2)}% Excess
          </Text>
          <Text fontSize="xs" textAlign="center">
            ({rawNetEnergy.toFixed(2)} W)
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};
export default WeatherCard;
