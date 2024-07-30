import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: "#E6F6FF",
    100: "#BAE3FF",
    200: "#7CC4FA",
    300: "#47A3F3",
    400: "#2186EB",
    500: "#0967D2",
    600: "#0552B5",
    700: "#03449E",
    800: "#01337D",
    900: "#002159",
  },
  accent: {
    50: "#FFF3E6",
    100: "#FFE0B2",
    200: "#FFCC80",
    300: "#FFB74D",
    400: "#FFA726",
    500: "#FF9800",
    600: "#FB8C00",
    700: "#F57C00",
    800: "#EF6C00",
    900: "#E65100",
  },
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
  },
  green: {
    100: "#ddf4e4",
    500: "#0a7146",
  },
  yellow: {
    200: "#fff8df",
    500: "#bd8400",
  },
};

const fonts = {
  heading: "'Poppins', sans-serif",
  body: "'Inter', sans-serif",
  mono: "Menlo, monospace",
};

const shadows = {
  outline: "0 0 0 4px rgba(9, 103, 210, 0.3)",
  table:
    "0 14px 66px rgba(0,0,0,.07), 0 10px 17px rgba(0,0,0,.03), 0 4px 7px rgba(0,0,0,.05)",
  drop: "0 4px 17px 0 rgba(0, 0, 0, 0.1)",
  buttonHover: "4px 4px 0 0 rgba(9, 103, 210, 0.2)",
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  shadows,
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.800",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        borderRadius: "md",
        _focusVisible: {
          outline: "4px solid",
          outlineColor: "brand.400",
          outlineOffset: -1,
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
            boxShadow: "buttonHover",
          },
          _active: {
            boxShadow: "none",
          },
        },
        outline: {
          borderColor: "brand.500",
          color: "brand.500",
          _hover: {
            boxShadow: "buttonHover",
          },
          _active: {
            boxShadow: "none",
          },
        },
      },
      sizes: {
        md: {
          py: 2,
          px: 4,
        },
        sm: {
          fontSize: "sm",
          py: 1.5,
          px: 2,
        },
      },
    },
    Heading: {
      baseStyle: {
        color: "brand.700",
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
          _focusVisible: {
            borderColor: "brand.400",
            boxShadow: "0 0 0 1px rgba(9, 103, 210, 0.6)",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: "brand.500",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        _hover: {
          color: "brand.600",
        },
      },
    },
  },
});

export default theme;
