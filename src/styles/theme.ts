import { extendTheme } from "@chakra-ui/react";
import Button from "./components/button";
import Modal from "./components/modal";
import Popover from "./components/popover";

export const colors = {
  primary: {
    100: "#b4e4fd",
    200: "#8ad4fb",
    300: "#5fc5fa",
    400: "#35b5f8",
    500: "#00acee",
    600: "#008fd0",
    700: "#0071b2",
    800: "#005491",
    900: "#003771",
  },
  secondary: {
    100: "#010409",
    500: "#0D1117",
    900: "#161B22",
  },
  background: {
    100: "#1B1E23",
    500: "#20232A",
    900: "#2B2F39",
  },
  error: {
    100: "#160705",
    500: "#EA4F30",
    900: "#FAEDEA",
  },
  warning: {
    100: "#170F02",
    500: "#F0AD2D",
    900: "#FDF4E7",
  },
  success: {
    100: "#091108",
    500: "#1EB871",
    900: "#EFF7EE",
  },
  text: {
    100: "#000000",
    500: "#C4C4C4",
    900: "#FFFFFF",
  },
  transparent: {
    main: "rgba(0, 0, 0, 0.5)",
    dark: "rgba(0, 0, 0, 0.7)",
  },
};

export const theme = extendTheme({
  components: {
    Button,
    Modal,
    Popover,
  },
  colors,
  styles: {
    global: () => ({
      "*, *::before, *::after": {
        WebkitTapHighlightColor: "transparent",
      },
      body: {
        bg: "secondary.100",
      },
    }),
  },
  fonts: {
    heading: "Poppins",
    body: `Poppins`,
  },
});
