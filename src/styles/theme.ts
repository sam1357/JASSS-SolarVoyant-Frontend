import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { theme as baseTheme } from "@saas-ui/react";

export const theme = extendTheme(
  {
    colors: {
      brand: {
        100: "#FF914D",
      },
    },
    fonts: {
      heading: "var(--font-inter)",
      body: "var(--font-inter)",
    },
  },
  baseTheme
);
