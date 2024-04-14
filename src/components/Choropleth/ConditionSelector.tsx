import { Divider, HStack, useBreakpointValue, Text } from "@chakra-ui/react";
import React from "react";
import { FaSolarPanel } from "react-icons/fa";
import { FaTemperatureEmpty } from "react-icons/fa6";
import { ChoroplethConditionData } from "@src/interfaces";
import { BsCloudsFill, BsSunFill } from "react-icons/bs";
import { SelectButton, SelectList, SelectOption, Select } from "@saas-ui/react";

// needs to be here due to tsx elements
export const CHOROPLETH_AVAILABLE_CONDITIONS: ChoroplethConditionData[] = [
  {
    label: "Temperature",
    unit: "°C",
    value: "temperature_2m",
    icon: <FaTemperatureEmpty />,
  },
  {
    label: "Solar Irradiance",
    unit: "MJ/m²",
    value: "shortwave_radiation",
    icon: <FaSolarPanel />,
  },
  {
    label: "Cloud Cover",
    unit: "%",
    value: "cloud_cover",
    icon: <BsCloudsFill />,
  },
  {
    label: "Sunshine Duration",
    unit: "hrs",
    value: "sunshine_duration",
    icon: <BsSunFill />,
  },
];

interface ConditionSelectorProps {
  selectedCondition: string;
  // eslint-disable-next-line
  setSelectedCondition: (condition: string) => void;
  width?: string;
  onClose: () => void;
}

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedCondition,
  setSelectedCondition,
  width,
  onClose,
}) => {
  const { label, icon } = CHOROPLETH_AVAILABLE_CONDITIONS.find(
    (condition) => condition.value === selectedCondition
  ) as any;
  const breakpoint = useBreakpointValue({ base: "base", lg: "lg", xl: "xl" });

  const renderValue =
    breakpoint !== "xl"
      ? () => icon
      : () => (
          <HStack>
            {icon}
            <Text>{label}</Text>
          </HStack>
        );

  return (
    <Select defaultValue={label} renderValue={renderValue} width={width} variant="filled" size="lg">
      <SelectButton />
      <SelectList>
        {CHOROPLETH_AVAILABLE_CONDITIONS.map((condition) => (
          <SelectOption
            value={condition.label}
            key={condition.value}
            onClick={() => setSelectedCondition(condition.value)}
            onFocus={() => {
              // if on mobile, close the solar info card when the user focuses on the search bar
              if (breakpoint !== "xl") {
                onClose();
              }
            }}
          >
            <HStack>
              {condition.icon}
              <Divider orientation="vertical" />
              <span>{condition.label}</span>
            </HStack>
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
