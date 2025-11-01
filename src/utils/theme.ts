import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  components: {
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
  },
  palette: {
    primary: {
      main: "#9BCFB5",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
