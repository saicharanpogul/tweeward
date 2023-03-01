import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  // Styles for the base style
  baseStyle: {},
  // Styles for the size variations
  sizes: {},
  // Styles for the visual style variations
  variants: {
    primary: {
      backgroundColor: "background.900",
      color: "text.900",
      _hover: {
        backgroundColor: "background.500",
      },
    },
    secondary: {
      backgroundColor: "transparent",
      border: "1px solid whiteSmoke",
      color: "text.900",
      _hover: {
        backgroundColor: "background.500",
      },
    },
    cta: {
      bgGradient: "linear(to-l, primary.300, primary.500)",
      // backgroundColor: "primary.500",
      color: "text.900",
      _hover: {
        bgGradient: "linear(to-l, primary.200, primary.200)",
      },
    },
  },
  // The default `size` or `variant` values
  defaultProps: {},
});

export default Button;
