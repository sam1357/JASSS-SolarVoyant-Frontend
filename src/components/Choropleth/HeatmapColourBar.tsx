import { Box, BoxProps, HStack, Tooltip, Text, useColorMode } from "@chakra-ui/react";
import { ChoroplethColourValueMapping } from "@src/interfaces";
import store from "@src/store";
import { colors } from "@src/styles/colours";
import React from "react";

interface HeatmapColourBarProps extends BoxProps {}

const EndLabel: React.FC<{
  isStart: boolean;
  choroplethMapping: ChoroplethColourValueMapping[];
}> = ({ isStart, choroplethMapping }) => {
  return (
    <Text
      paddingRight={isStart ? 3 : 0}
      paddingLeft={isStart ? 0 : 3}
      fontSize="sm"
      fontWeight={600}
      display="inline"
      whiteSpace="nowrap"
    >
      {choroplethMapping[isStart ? 0 : choroplethMapping.length - 1].label}
    </Text>
  );
};

const HeatmapColourBar: React.FC<HeatmapColourBarProps> = ({ ...rest }) => {
  const { choroplethMapping } = store.getState();

  const labels = choroplethMapping.map((mapping) => mapping.label);
  const { colorMode } = useColorMode();

  // Use inverse colors if the label is a percentage, as lower is better
  const colorsToUse = Object.values(
    labels[0].includes("%") ? colors.choroplethInverse : colors.choropleth
  );

  return (
    <HStack
      {...rest}
      spacing={0}
      borderWidth="2px"
      padding={2}
      backgroundColor={colorMode === "light" ? "white" : "gray.700"}
      borderColor={colorMode === "light" ? "gray.400" : "gray.700"}
      borderRadius="lg"
    >
      <EndLabel isStart choroplethMapping={choroplethMapping} />
      {colorsToUse.map((color, index) => (
        <Tooltip label={labels[index]} key={index}>
          <Box
            backgroundColor={color}
            width={{ base: "20px", lg: "35px" }}
            height="20px"
            borderRadius="md"
            marginRight={index !== colorsToUse.length - 1 ? "-4px" : "0"}
          />
        </Tooltip>
      ))}
      <EndLabel isStart={false} choroplethMapping={choroplethMapping} />
    </HStack>
  );
};

export default HeatmapColourBar;
