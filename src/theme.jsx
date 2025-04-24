import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
        margin: 0,
        backgroundColor: "#0f0f0f",
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#0f0f0f",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "5px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },

        color: "white",
      },
      "*": {
        boxSizing: "border-box",
      },
    },
  },
  fonts: {},
  components: {
    Box: {
      baseStyle: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
    },
    Text: {
      baseStyle: {
        color: "white",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "md",
        fontFamily: "system-ui, sans-serif",
      },
    },
  },
});

export default theme;
