import { mode } from "@chakra-ui/theme-tools";

export const globalStyles = {
  styles: {
    global: (props) => ({
      body: {
        bg: mode("gray.50", "gray.800")(props),
        color: mode("gray.800", "gray.200")(props),
        fontFamily: "'Roboto', sans-serif",
        lineHeight: "base",
        transition: "background-color 0.2s, color 0.2s",
      },
      "*::placeholder": {
        color: mode("gray.400", "whiteAlpha.400")(props),
      },
      "*, *::before, *::after": {
        borderColor: mode("gray.200", "whiteAlpha.300")(props),
        wordWrap: "break-word",
      },
    }),
  },
};
