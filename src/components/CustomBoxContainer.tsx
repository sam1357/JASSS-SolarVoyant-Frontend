import React from "react";
import { Box, BoxProps, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MdLightMode, MdDarkMode } from "react-icons/md";



interface CustomBoxProps extends BoxProps {
    children: React.ReactNode;
}

const CustomBoxContainer: React.FC<CustomBoxProps> = ({ children, ...props }) => {
  return (
    <Box w='90%' p={4} {...props} borderWidth='1px' borderRadius='lg'>
        {children}
    </Box>
  );
};

export default CustomBoxContainer;
