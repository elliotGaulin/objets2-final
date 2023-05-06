import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import Intrusions from './Pages/Intrusions';
import { frFR } from '@mui/material/locale';

function App() {

  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  },
    frFR);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar setTheme={setMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intrusions" element={<Intrusions />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
