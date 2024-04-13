"use client";
import { Card, CardBody, Box, Heading, Text, Image, Center } from "@chakra-ui/react";
import { DashboardData } from "@interfaces/index";
import { getDayOfWeek } from "./utils";
import { useEffect, useState } from "react";

interface WeatherCardProps {
  index: 0 | 1 | 2 | 3 | 4 | 5 | 6; // day of week
  data: DashboardData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ index, data }) => {
  const [day, setDay] = useState("");

  useEffect(() => {
    // Get the name of the day of the week
    const getDay = () => {
      const dayOfWeek = getDayOfWeek(index);
      setDay(dayOfWeek);
    };
    getDay();
  }, []);

  return (
    // TODO: Currently changes colour on hover, change to on select
    <Card borderRadius="3xl" _hover={{ bg: "#0095e6" }}>
      <CardBody>
        <Heading fontSize="xl" textAlign="center">
          {day}
        </Heading>
        <Center>
          <Image
            src={data[index].weather_code.image}
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
