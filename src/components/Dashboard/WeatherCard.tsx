"use client";
import { Card, CardBody, Box, Heading, Text, Image, Center } from "@chakra-ui/react";
import { WeekWeatherCodes } from "@interfaces/index";
import { getDayOfWeek } from "@components/Dashboard/utils";
import { useEffect, useState } from "react";

interface WeatherCardProps {
  index: number; // day of week
  data: WeekWeatherCodes;
  isActive: boolean;
  onClick: () => void;
}

type Index = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WeatherCard: React.FC<WeatherCardProps> = ({ index, data, isActive, onClick }) => {
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
      minW="130px"
      maxW="150px"
      w="100%"
    >
      <CardBody>
        <Heading fontSize="xl" textAlign="center">
          {day}
        </Heading>
        <Center>
          <Image
            src={data[index as Index].image}
            alt="Weather image"
            style={{ maxWidth: "100%" }}
            marginBottom={-2}
            marginTop={-2}
          />
        </Center>
        <Box>
          <Text fontSize="md" textAlign="center">
            2.22% Excess
          </Text>
          <Text fontSize="xs" textAlign="center">
            (+242W)
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};
export default WeatherCard;
