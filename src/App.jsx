import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Layouts from './layouts';
import routes from './routes';
import { getTheme } from './themes/theme';

const App = () => {
  const { role } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const theme = getTheme(darkMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layouts>
        <Routes>{routes.map((route, index) => route.role.includes(role) && <Route key={index} path={route.path} element={route.element} />)}</Routes>
      </Layouts>
    </ThemeProvider>
  );
};

export default App;
