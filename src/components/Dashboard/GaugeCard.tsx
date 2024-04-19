"use client";
import {
  Card,
  CardBody,
  Heading,
  useColorMode,
  Box,
  VStack,
  HStack,
  SimpleGrid,
  AbsoluteCenter,
  useBreakpoint,
} from "@chakra-ui/react";
import { getAttributeName } from "./utils";
import { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { Conditions, GaugeLabels, Units } from "@src/interfaces";
import { colors } from "@src/styles/colours";

interface GaugeCardProps {
  data: Conditions & { units: Units };
  attribute:
    | "temperature_2m"
    | "daylight_hours"
    | "sunshine_hours"
    | "shortwave_radiation"
    | "cloud_cover";
  labels: GaugeLabels;
  inverse?: boolean;
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const GaugeCard: React.FC<GaugeCardProps> = ({ data, attribute, labels, inverse = false }) => {
  const [title, setTitle] = useState("");
  const { colorMode } = useColorMode();
  const gaugeColour = colorMode === "light" ? colors.gray[200] : colors.gray[700];
  const breakpoint = useBreakpoint();

  const gaugeWidth = ["md", "sm", "base"].includes(breakpoint) ? "200px" : "230px";

  const getStatus = (value: number) => {
    if (value < labels.low.limit) {
      return labels.low.label;
    } else if (value >= labels.low.limit && value <= labels.high.limit) {
      return labels.medium.label;
    } else {
      return labels.high.label;
    }
  };

  const getColour = (value: number, inverse: boolean) => {
    if (inverse) {
      if (value < labels.low.limit) {
        return colors.red[400];
      } else if (value >= labels.low.limit && value <= labels.high.limit) {
        return colors.yellow[400];
      } else {
        return colors.green[400];
      }
    }

    if (value < labels.low.limit) {
      return colors.green[400];
    } else if (value >= labels.low.limit && value <= labels.high.limit) {
      return colors.yellow[400];
    } else {
      return colors.red[400];
    }
  };

  const labelColour = getColour(data[attribute] as number, inverse);
  const value = data[attribute] as number;
  let clampedValue = clamp(value, labels.minimum, labels.maximum);
  if (clampedValue === labels.minimum) {
    clampedValue *= 1.001;
  }

  const subArcs = [
    {
      limit: clampedValue,
      color: labelColour,
    },
    {
      limit: labels.maximum,
      color: gaugeColour,
      showTick: true,
    },
  ];

  useEffect(() => {
    // for formatted date
    const getFormattedAttribute = () => {
      const formattedAttribute = getAttributeName(attribute);
      setTitle(formattedAttribute);
    };
    getFormattedAttribute();
  }, []); // eslint-disable-line

  return (
    <Card borderRadius="3xl" width="100%" height="100%" minW="250px" align="center">
      <AbsoluteCenter axis="vertical">
        <CardBody>
          <SimpleGrid
            columns={{ xl: 1, "2xl": 2 }}
            alignItems="center"
            justifyContent="center"
            justifyItems="center"
          >
            <VStack display="flex" justifyContent="center" pt={2}>
              <Heading fontSize="2xl">{title}</Heading>
              <HStack>
                <Heading fontSize="3xl" p={1}>
                  {data[attribute]}
                </Heading>
                <Heading fontSize="lg" pt={1}>
                  {data.units[attribute]}
                </Heading>
              </HStack>
            </VStack>
            <Box display="flex" justifyContent="center">
              <Box maxW="250px">
                <GaugeComponent
                  type="semicircle"
                  arc={{
                    width: 0.15,
                    cornerRadius: 0,
                    padding: 0.003,
                    subArcs,
                  }}
                  labels={{
                    valueLabel: {
                      formatTextValue: () => getStatus(value),
                      style: {
                        fill: labelColour,
                        textShadow: "none",
                        fontWeight: 700,
                      },
                    },
                    tickLabels: {
                      type: "outer",
                    },
                  }}
                  pointer={{
                    elastic: false,
                    type: "arrow",
                    width: 15,
                  }}
                  value={clampedValue}
                  minValue={labels.minimum}
                  maxValue={labels.maximum}
                  style={{ width: gaugeWidth }}
                />
              </Box>
            </Box>
          </SimpleGrid>
        </CardBody>
      </AbsoluteCenter>
    </Card>
  );
};
export default GaugeCard;
