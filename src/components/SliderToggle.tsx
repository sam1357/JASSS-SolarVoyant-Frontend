"use client";

import React from "react";
import {
  Text,
  Box,
  Flex,
  Grid,
  GridItem,
  Stack,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import CustomFormControlOnChange from "./AuthPages/CustomFormControlOnChange";

interface onEnergyConsumptionChangeType {
  // eslint-disable-next-line
  (newState: Partial<surfaceAreaData>): void;
}

interface CustomUserDataContainerProps {
  onEnergyConsumptionChange: onEnergyConsumptionChangeType;
}

interface surfaceAreaData {
  quarter1C?: string;
  quarter2C?: string;
  quarter3C?: string;
  quarter4C?: string;
  householdMembers?: number;
  use?: string;
}

const SliderToggle: React.FC<CustomUserDataContainerProps> = ({ onEnergyConsumptionChange }) => {
  // Function to handle input change in energy consumption
  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    onEnergyConsumptionChange({
      [name]: value,
    });
  };

  // Function to handle tab change in energy consumption toggle
  const handleTabChange = (index: number) => {
    if (index === 0) {
      onEnergyConsumptionChange({
        use: "householdMembers",
      });
    } else {
      onEnergyConsumptionChange({
        use: "quarterlyConsumption",
      });
    }
  };

  return (
    <Box my={"auto"} width={"100%"} mx={"auto"} height="100%">
      <Stack direction="column" gap={4} my={4} textAlign="left">
        <Text fontSize="xl" fontWeight={600}>
          What is your energy consumption?
        </Text>
        <Text fontSize="lg">
          Toggle the switch if you are unsure to estimate energy use from household size.
        </Text>
      </Stack>

      <Flex justify="center" align="center" gap={4}>
        <Tabs variant="soft-rounded" w="100%" onChange={handleTabChange}>
          <TabList w="100%" mb={4}>
            <Tab w="50%">Easy</Tab>
            <Tab w="50%">Custom</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Select
                variant="outline"
                onChange={handleInputChange}
                defaultValue="2"
                name="householdMembers"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
              </Select>
            </TabPanel>
            <TabPanel>
              <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={1} w={"100%"}>
                <GridItem>
                  <CustomFormControlOnChange
                    errors={{}}
                    name="quarter1C"
                    label="Q1 (W)"
                    register={() => {}}
                    onChange={handleInputChange}
                  />
                </GridItem>
                <GridItem>
                  <CustomFormControlOnChange
                    errors={{}}
                    name="quarter2C"
                    label="Q2 (W)"
                    register={() => {}}
                    onChange={handleInputChange}
                  />
                </GridItem>
                <GridItem>
                  <CustomFormControlOnChange
                    errors={{}}
                    name="quarter3C"
                    label="Q3 (W)"
                    register={() => {}}
                    onChange={handleInputChange}
                  />
                </GridItem>
                <GridItem>
                  <CustomFormControlOnChange
                    errors={{}}
                    name="quarter4C"
                    label="Q4 (W)"
                    register={() => {}}
                    onChange={handleInputChange}
                  />
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default SliderToggle;
