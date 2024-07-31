const Card = {
  baseStyle: {
    p: 5,
    display: "flex",
    flexDirection: "column",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  variants: {
    panel: (props) => ({
      bg: props.colorMode === "dark" ? "gray.700" : "white",
    }),
  },
};
export const CardComponent = {
  components: {
    Card,
  },
};
