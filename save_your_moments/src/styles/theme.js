// theme/index.js
import { extendTheme } from "@chakra-ui/react";
import { globalStyles } from "./global";
import { breakpoints } from "./foundations/breakpoints";
import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { linkStyles } from "./components/link";
import { drawerStyles } from "./components/drawer";
import { CardComponent } from "./additions/card/Card";
import { CardBodyComponent } from "./additions/card/CardBody";
import { CardHeaderComponent } from "./additions/card/CardHeader";
import { MainPanelComponent } from "./additions/layout/MainPanel";
import { PanelContentComponent } from "./additions/layout/PanelContent";
import { PanelContainerComponent } from "./additions/layout/PanelContainer";

const customColors = {
  brand: {
    50: "#E6F6FF",
    100: "#BAE3FF",
    200: "#7CC4FA",
    300: "#47A3F3",
    400: "#2186EB",
    500: "#0C6AB4", // Teal-like main brand color
    600: "#005B96",
    700: "#004374",
    800: "#002B52",
    900: "#001730",
  },
  text: {
    primary: "#000000", // Black for primary text
    secondary: "#4A4A4A", // Dark gray for secondary text
  },
  background: {
    default: "#FFFFFF", // White for backgrounds
  },
  gray: {
    100: "#f7fafc",
    200: "#edf2f7",
    300: "#e2e8f0",
    400: "#cbd5e0",
    500: "#a0aec0",
    600: "#718096",
    700: "#4a5568",
    800: "#2d3748",
    900: "#1a202c",
  },
};

const theme = extendTheme(
  { breakpoints, colors: customColors }, // Breakpoints and custom colors
  globalStyles,
  buttonStyles, // Button styles
  badgeStyles, // Badge styles
  linkStyles, // Link styles
  drawerStyles, // Drawer styles
  CardComponent, // Card component
  CardBodyComponent, // Card Body component
  CardHeaderComponent, // Card Header component
  MainPanelComponent, // Main Panel component
  PanelContentComponent, // Panel Content component
  PanelContainerComponent // Panel Container component
);

export default theme;
