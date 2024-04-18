"use client";
import {
  Card,
  CardBody,
  Box,
  Heading,
  Text,
  Image,
  Center,
  Flex,
  Divider,
  Button,
  Link,
} from "@chakra-ui/react";
import { getFormattedDate } from "./utils";
import { useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5";
import { currentWeatherData } from "@src/interfaces";

interface StatsCardProps {
  data: currentWeatherData;
}

const StatsCard: React.FC<StatsCardProps> = ({ data }) => {
  const [date, setDate] = useState("");

  useEffect(() => {
    // for formatted date
    const getDate = () => {
      const date = getFormattedDate();
      setDate(date);
    };
    getDate();
  }, []);

  return (
    <Card borderRadius="3xl">
      <CardBody>
        <Heading fontSize="xl" textAlign="center">
          {date}
        </Heading>
        <Text fontSize="md" textAlign="center">
          {data.suburb}, Sydney
        </Text>
        <Center>
          <Image
            src={data.weather_code.image}
            alt="Image"
            style={{ maxWidth: "100%" }}
            marginBottom={-2}
            marginTop={-2}
          />
        </Center>
        <Box marginBottom={3}>
          <Heading fontSize="xl" textAlign="center" padding={2}>
            {data.weather_code.description}
          </Heading>
        </Box>
        <Box display={"flex"} textAlign={"center"}>
          <Flex width="100%" justifyContent={"center"} alignContent={"center"}>
            <Box paddingLeft={2} paddingRight={3}>
              <Text fontSize="md" textAlign="center">
                Current Temp
              </Text>
              <Text fontSize="md" textAlign="center">
                {data.current_conditions.temperature_2m} °C
              </Text>
            </Box>
            <Divider height="100%" orientation="vertical" color={`rgba(31, 31, 31)`} />
            <Box paddingLeft={3} paddingRight={3}>
              <Text fontSize="md" textAlign="center">
                Daylight Hours
              </Text>
              <Text fontSize="md" textAlign="center">
                {data.current_conditions.daylight_hours}
              </Text>
            </Box>
            <Divider height="100%" orientation="vertical" />
            <Box paddingLeft={3}>
              <Text fontSize="md" textAlign="center">
                Solar Irradiance
              </Text>
              <Text fontSize="md" textAlign="center">
                {data.current_conditions.shortwave_radiation} W/m²
              </Text>
            </Box>
          </Flex>
        </Box>
      </CardBody>
    </Card>
  );
};
export default StatsCard;
