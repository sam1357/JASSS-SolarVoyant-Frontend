"use client";
import { Card, CardBody, Heading, Text, Flex, Grid, GridItem } from "@chakra-ui/react";
import { GaugeLabels } from "@interfaces/index";
import { getAttributeName } from "./utils";
import { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";

interface GaugeCardProps {
  data: any; // Change the type here, I have temporarily changed it to any
  attribute: "temperature_2m"; // TODO: add more here as you wish
  labels: GaugeLabels;
}

const GaugeCard: React.FC<GaugeCardProps> = ({ data, attribute, labels }) => {
  const [title, setTitle] = useState("");

  const getStatus = (value: number) => {
    if (value < labels.low.limit) {
      return labels.low.label;
    } else if (value >= labels.low.limit && value <= labels.high.limit) {
      return labels.medium.label;
    } else {
      return labels.high.label;
    }
  };

  useEffect(() => {
    // for formatted date
    const getFormattedAttribute = () => {
      const formattedAttribute = getAttributeName(attribute);
      setTitle(formattedAttribute);
    };
    getFormattedAttribute();
  }, []); // eslint-disable-line

  return (
    // TODO: Width is hardcoded atm, can be taken out once the dashboard page is divided as a grid
    <Card borderRadius="3xl" flex={"true"} width={"30%"}>
      <CardBody>
        <Grid templateColumns="repeat(1, 1fr)" templateRows="repeat(1, 1fr)" minWidth={"100%"}>
          <Flex>
            <GridItem colSpan={1} rowSpan={1} width={"40%"} paddingTop={5} paddingLeft={2}>
              <Text fontSize="3xl">{title}</Text>
              <Flex>
                <Heading fontSize="6xl" padding={2}>
                  {data[attribute]}
                </Heading>
                <Heading fontSize="xl" paddingTop={2}>
                  {data.units[attribute]}
                </Heading>
              </Flex>
            </GridItem>
            <GridItem colSpan={1} rowSpan={1} width={"60%"} padding={2}>
              <GaugeComponent
                type="semicircle"
                arc={{
                  width: 0.3,
                  cornerRadius: 0,
                  padding: 0.003,
                  subArcs: [
                    {
                      limit: data[attribute],
                      color: "#0095e6",
                      showTick: true,
                    },
                    {
                      limit: labels.maximum,
                      color: "#18202b",
                      showTick: true,
                    },
                  ],
                }}
                labels={{
                  valueLabel: {
                    formatTextValue: getStatus,
                  },
                  tickLabels: {
                    type: "outer",
                  },
                }}
                // TODO: After final setup change the needle colour to the background to make it invisible
                pointer={{ type: undefined, color: "#2b313c", elastic: false }}
                value={data[attribute]}
                minValue={labels.minimum}
                maxValue={labels.maximum}
              />
            </GridItem>
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  );
};
export default GaugeCard;
