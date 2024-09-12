// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

export const getTheme = (darkMode) => {
  return createTheme({
    typography: {
      fontFamily: 'Poppins',
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#5e43f3',
      },
      secondary: {
        main: '#dc004e',
      },
      success: {
        main: '#4caf50',
      },
      warning: {
        main: '#ff9800',
      },
      papaya: {
        main: '#FDF0D5',
      },
      error: {
        main: '#f44336',
      },
      ...(darkMode && {
        background: {
          default: '#121212', // Background color for dark mode
          paper: '#1d1d1d', // Paper background for dark mode
        },
        text: {
          primary: '#ffffff', // Text color for dark mode
        },
      }),
    },
  });
};
