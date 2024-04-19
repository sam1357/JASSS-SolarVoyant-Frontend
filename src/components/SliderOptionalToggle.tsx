"use client";

import React from "react";
import {
  Text,
  Box,
  Grid,
  GridItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Session } from "@src/interfaces";
import CustomFormControlOnChange from "./AuthPages/CustomFormControlOnChange";

interface CustomUserDataContainerProps {
  session: Session;
  // eslint-disable-next-line
  onEnergyGenerationChange: (newState: Partial<SurfaceAreaData>) => void;
}

interface SurfaceAreaData {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  use?: string;
}

const SliderOptionalToggle: React.FC<CustomUserDataContainerProps> = ({
  onEnergyGenerationChange,
}) => {
  const handleTabChange = (index: number) => {
    if (index === 0) {
      onEnergyGenerationChange({
        use: "easy",
      });
    } else {
      onEnergyGenerationChange({
        use: "custom",
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    onEnergyGenerationChange({
      [name]: value,
    });
  };

  return (
    <Box my="auto" width="100%" mx="auto" height="100%">
      <Stack direction="column" gap={4} my={4} textAlign="left">
        <Text fontSize="xl" fontWeight={600}>
          What is your energy generation?
        </Text>
        <Text fontSize="lg">Toggle the switch to opt for default values.</Text>
      </Stack>
      <Tabs variant="soft-rounded" w="100%" onChange={handleTabChange}>
        <TabList w="100%" mb={4}>
          <Tab w="50%">Easy</Tab>
          <Tab w="50%">Custom</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box display="flex" justifyContent="center" mb={2}>
              <Text fontSize="lg" fontWeight={600}>
                Default values selected
              </Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} mt={1} w="100%">
              {["q1", "q2", "q3", "q4"].map((quarter, index) => (
                <GridItem key={index}>
                  <CustomFormControlOnChange
                    errors={{}}
                    name={quarter}
                    label={`Q${index + 1} (W)`}
                    register={() => {}}
                    onChange={handleInputChange}
                  />
                </GridItem>
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SliderOptionalToggle;
