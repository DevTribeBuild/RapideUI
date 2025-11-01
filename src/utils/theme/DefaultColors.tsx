import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#ffd700", // Accent color
      light: "#ffdf33",
      dark: "#b29600",
    },
    secondary: {
      main: "#4caf50", // Green
      light: "#81c784",
      dark: "#388e3c",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
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
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          transition: "all 0.25s ease-in-out",
          "&.Mui-selected": {
            backgroundColor: "#FFD700 !important",
            color: "#000",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#FFD700 !important",
            transform: "scale(1.02)",
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

export { baselightTheme };
