import React from "react";
import { IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const ColourModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Tooltip label="Toggle colour mode">
      <IconButton
        size="lg"
        aria-label="Colour mode toggle"
        icon={colorMode === "light" ? <MdLightMode /> : <MdDarkMode />}
        onClick={toggleColorMode}
        colorScheme="gray"
      />
    </Tooltip>
  );
};

export default ColourModeToggle;
