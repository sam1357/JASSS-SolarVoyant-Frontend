import React from "react";
import { Flex, Divider, Text } from "@chakra-ui/react";

interface DividerWithTextProps {
  text: string;
}

const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  return (
    <Flex align="center">
      <Divider />
      <Text width={"auto"} padding="2" whiteSpace="nowrap">
        {text}
      </Text>
      <Divider />
    </Flex>
  );
};

export default DividerWithText;
