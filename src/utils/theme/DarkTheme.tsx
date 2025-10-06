import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const basedarkTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD700", // Gold
      light: "#FFFF00",
      dark: "#B8860B",
    },
    secondary: {
      main: "#FFFFFF", // White
      light: "#F5F5F5",
      dark: "#A9A9A9",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#A9A9A9",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: "3rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: "2.5rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: "2.25rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: "2rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: "1.5rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: "1.5rem",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: "1.25rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#B8860B",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
  },
});

export { basedarkTheme };
