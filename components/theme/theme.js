// components/theme/theme.js

import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "dark", // Start with dark mode for a consistent look initially
    primary: {
      main: "#d4af37", // Gold color for primary actions
    },
    secondary: {
      main: "#333333", // Secondary color, used for contrast or text
    },
    background: {
      default: "#222222", // Dark background for consistency
      paper: "#333333", // Slightly lighter for contrast
    },
    text: {
      primary: "#f0f0f0",
      secondary: "#cccccc",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          transition: "background-color 0.3s ease",
        },
      },
    },
  },
});

export default muiTheme;
