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
} from "@chakra-ui/react";
import { TodayData } from "@interfaces/index";
import { getFormattedDate } from "./utils";
import { useEffect, useState } from "react";
import { IoArrowForward } from "react-icons/io5";

interface StatsCardProps {
  data: TodayData;
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
          <Heading fontSize="xl" textAlign="center">
            {data.weather_code.description}
          </Heading>
        </Box>
        <Flex width="100%" paddingBottom={4}>
          <Box paddingRight={2}>
            <Text fontSize="xs" textAlign="center">
              Solar Irradiance
            </Text>
            <Text fontSize="md" textAlign="center">
              {data.solar_radiation} W/m²
            </Text>
          </Box>
          <Divider height="65px" orientation="vertical" color={`rgba(31, 31, 31)`} />
          <Box paddingLeft={2} paddingRight={2}>
            <Text fontSize="xs" textAlign="center">
              Daylight Hours
            </Text>
            <Text fontSize="md" textAlign="center">
              {data.daylight_hours}
            </Text>
          </Box>
          <Divider height="65px" orientation="vertical" />
          <Box paddingLeft={2}>
            <Text fontSize="xs" textAlign="center">
              Current Temp
            </Text>
            <Text fontSize="md" textAlign="center">
              {data.temperature_2m} °C
            </Text>
          </Box>
        </Flex>
        <Button
          rightIcon={<IoArrowForward />}
          colorScheme="blue"
          variant="outline"
          borderRadius={100}
          width="100%"
          height={7}
        >
          More Details
        </Button>
      </CardBody>
    </Card>
  );
};
export default StatsCard;
