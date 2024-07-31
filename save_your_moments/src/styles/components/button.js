export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "8px",
        _focus: {
          boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
          _active: {
            bg: "brand.700",
          },
        },
        outline: {
          borderColor: "brand.500",
          color: "brand.500",
          _hover: {
            bg: "brand.50",
          },
          _active: {
            bg: "brand.100",
          },
        },
        ghost: {
          _hover: {
            bg: "gray.100",
          },
        },
      },
      sizes: {
        lg: {
          h: 12,
          fontSize: "lg",
          px: 6,
        },
        md: {
          h: 10,
          fontSize: "md",
          px: 5,
        },
        sm: {
          h: 8,
          fontSize: "sm",
          px: 4,
        },
      },
    },
  },
};
