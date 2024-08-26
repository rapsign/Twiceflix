import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
        margin: 0,
        backgroundColor: "black",
        color: "white",
      },
      "*": {
        boxSizing: "border-box",
      },
    },
  },
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
      },
    },
  },
});

export default theme;
