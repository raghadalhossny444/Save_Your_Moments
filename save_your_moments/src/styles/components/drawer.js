// components/drawer.js
export const drawerStyles = {
  components: {
    Drawer: {
      baseStyle: {
        overlay: {
          backdropFilter: "blur(4px)",
        },
      },
      variants: {
        "with-shadow": {
          placement: "right",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
};
