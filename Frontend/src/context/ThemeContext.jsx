import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const userPreferDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return userPreferDark ? "dark" : "light";
    }
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const baseThemeSettings = {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
              border: "3px solid #f1f1f1",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          },
        },
      },
      MuiBox: {
        styleOverrides: {
          root: {
            width: {
              xs: "100%",
              sm: "75%",
              md: "50%",
              lg: "25%",
              xl: "15%",
            } /*
            p: 2,
            m: "auto",
            textAlign: "center",*/,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "16px",
              lg: "18px",
              xl: "20px",
            },
          },
        },
      },
    },
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#90caf9" },
      secondary: { main: "#f48fb1" },
      background: { default: "#121212", paper: "#1d1d1d" },
    },
    ...baseThemeSettings,
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
      background: { default: "#f5f5f5", paper: "#ffffff" },
    },
    ...baseThemeSettings,
  });

  const [materialUiTheme, setMaterialUiTheme] = useState(() =>
    theme === "dark" ? darkTheme : lightTheme
  );

  useEffect(() => {
    setMaterialUiTheme(theme === "dark" ? darkTheme : lightTheme);
  }, [theme, darkTheme, lightTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={materialUiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
