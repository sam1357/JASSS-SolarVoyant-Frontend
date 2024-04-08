import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { theme as baseTheme } from "@saas-ui/react";
import { colors } from "./colours";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const theme = extendTheme(
  {
    colors,
    config,
    fonts: {
      heading: "var(--font-inter)",
      body: "var(--font-inter)",
    },
    components: {
      Divider: {
        defaultProps: { size: "md" },
        sizes: {
          lg: { borderWidth: "4px" },
          md: { borderWidth: "2px" },
          sm: { borderWidth: "1px" },
        },
      },
      Button: {
        defaultProps: { size: "md", colorScheme: "primary" },
      },
      Input: {
        defaultProps: { size: "lg" },
      },
    },
  },
  baseTheme
);
