import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import {
  defineStyle,
  defineStyleConfig,
  createMultiStyleConfigHelpers,
} from "@chakra-ui/react";
import { modalAnatomy, inputAnatomy, alertAnatomy } from "@chakra-ui/anatomy";
import { cssVar } from "@chakra-ui/react";

// Define the foundation colors
const colors = {
  gray: {
    100: "#F7F7F7",
    150: "#F2F2F2",
    200: "#E7E7E7",
    300: "#C8C8C8",
    400: "#8C8C8C",
    500: "#616161",
    600: "#333333",
    700: "#222222",
    800: "#1B1B1B",
    900: "#141414",
  },
  blue: {
    50: "#F6F6FF",
    100: "#EBEBFF",
    200: "#D6D6FF",
    300: "#9999FF",
    400: "#5555FF",
    500: "#1C1CFF",
    600: "#0000E0",
    700: "#0000A3",
    800: "#000066",
    900: "#000029",
  },
  orange: {
    50: "#FFF3ED",
    100: "#FFE5D6",
    200: "#FFCBAD",
    300: "#FFB185",
    400: "#FF985C",
    500: "#FF7324",
    550: "#DF5A0E",
    600: "#B84300",
    700: "#7A2D00",
    800: "#521E00",
    900: "#2F1000",
  },
  red: {
    100: "#f7c8c8",
    500: "#b80000",
    900: "#1B0C0C",
  },
  green: {
    100: "#ddf4e4",
    400: "#48BB78",
    500: "#0a7146",
    900: "#0A160E",
  },
  yellow: {
    200: "#fff8df",
    500: "#bd8400",
  },
};

const shadows = {
  outline: "0 0 0 4px #5555FF",
  table:
    "0 14px 66px rgba(0,0,0,.07), 0 10px 17px rgba(0,0,0,.03), 0 4px 7px rgba(0,0,0,.05)",
  drop: "0 4px 17px 0 rgba(0, 0, 0, 0.15)",
  tableBox: {
    light:
      "0 14px 66px rgba(0,0,0,.07), 0 10px 17px rgba(0,0,0,.03), 0 4px 7px rgba(0,0,0,.05)",
    dark: "0 14px 66px hsla(0,0%,96.1%,.07), 0 10px 17px hsla(0,0%,96.1%,.03), 0 4px 7px hsla(0,0%,96.1%,.05)",
  },
  tableBoxHover: "0px 8px 17px rgba(0, 0, 0, 0.15)",
  tableItemBox: {
    light: "0 1px 1px rgba(0, 0, 0, 0.1)",
    dark: "0 1px 1px hsla(0,0%,100%,.1)",
  },
  tableItemBoxHover: "0 0 1px #1C1CFF",
  gridYellowBoxShadow: "8px 8px 0px 0px #FF7324",
  gridBlueBowShadow: "8px 8px 0px 0px #1C1CFF",
  primary: "4px 4px 0px 0px #5555FF",
  buttonHover: "4px 4px 0 0 #D6D6FF",
  tooltip: "0 0 16px rgba(0, 0, 0, 0.15)",
};

const spacing = {
  7.5: "1.875rem",
  10.5: "2.625rem",
  19: "4.75rem", // Nav height
};

const typography = {
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
    monospace: "var(--font-mono)",
  },
  lineHeights: {
    "6xs": 1.1,
    "5xs": 1.15,
    "4xs": 1.2,
    "3xs": 1.25,
    "2xs": 1.3,
    xs: 1.4,
    sm: 1.5,
    base: 1.6,
  },
};

const foundations = {
  colors,
  shadows,
  space: spacing,
  sizes: {
    ...spacing,
  },
  ...typography,
};

// Define component styles
const components = {
  Button: defineStyleConfig({
    baseStyle: {
      fontWeight: "normal",
      borderRadius: "base",
      transitionProperty: "common",
      transitionDuration: "normal",
      p: "unset",
      _focusVisible: {
        outline: "4px solid",
        outlineColor: "#5555FF",
        outlineOffset: -1,
      },
      _disabled: {
        color: "#C8C8C8",
        pointerEvents: "none",
      },
      _hover: {
        color: "#5555FF",
      },
      "&[data-secondary='true']": {
        color: "#222222",
      },
      "&.chakra-link": {
        textDecoration: "none",
        _hover: {
          textDecoration: "none",
        },
      },
    },
    variants: {
      solid: defineStyle({
        color: "#F7F7F7",
        bg: "#1C1CFF",
        borderColor: "transparent",
        _disabled: {
          bg: "#C8C8C8",
          color: "#F7F7F7",
        },
        _hover: {
          color: "#F7F7F7",
          bg: "#0000E0",
          boxShadow: "4px 4px 0 0 #D6D6FF",
        },
        _active: {
          boxShadow: "none",
        },
      }),
      outline: defineStyle({
        _hover: {
          boxShadow: "4px 4px 0 0 #D6D6FF",
        },
        _active: {
          boxShadow: "none",
        },
      }),
      ghost: {
        borderColor: "transparent",
      },
      link: defineStyle({
        borderColor: "transparent",
        fontWeight: 700,
        textDecor: "underline",
        py: 0,
        px: 1,
        _active: {
          color: "#1C1CFF",
        },
      }),
    },
    sizes: {
      md: defineStyle({
        py: "2",
        px: "4",
      }),
      sm: defineStyle({
        fontSize: "xs",
        py: "1.5",
        px: "2",
      }),
    },
    defaultProps: {
      size: "md",
      variant: "solid",
    },
  }),
  Heading: defineStyleConfig({
    baseStyle: {
      color: "#1C1CFF",
    },
  }),
  // Define other component styles similarly...
};

// Combine everything into a single theme object
const config = {
  cssVarPrefix: "eth",
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  ...foundations,
  components,
  styles: {
    global: {
      body: {
        bg: "#F7FAFC",
        color: "#1A202C",
      },
    },
  },
});

export default theme;
