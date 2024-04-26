import { useState } from 'react';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import LoginPage from './scenes/loginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import EventList from './components/EventList';
import GroupList from './components/GroupList';
import PreusersList from './components/verifypreuser';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import  ActivityList from './components/ActivityList';
// index.js ou index.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
//import { ColorModeContext as ThemeColorModeContext, useMode as useThemeMode } from "./theme";
import ElevateUsers from './components/Elevateusers';
import Calendar from './components/Calendar';
import Bestusers from './components/bestusers';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = useSelector((state) => {
    const { token, user } = state;
    //if (user) console.log(user.role === 'depHead', user.role)
    return token && ( user.role === 'depHead' || user.role === 'admin');
  });
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  }

  return (
    <Router>
      <div className={isAuth ? 'grid-container' : ''}>
        {isAuth && <Header OpenSidebar={OpenSidebar} />}
        {isAuth && <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/event" /> : <LoginPage />} />
              
            <Route path="/event" element={isAuth ? <EventList /> : <Navigate to="/" />} />            <Route path="/calendar" element={isAuth ? <Calendar /> : <Navigate to="/" />} />
              
            <Route path="/group" element={isAuth ? <GroupList /> : <Navigate to="/" />} />
              
            <Route path="/activity" element={isAuth ? <ActivityList /> : <Navigate to="/" />}  />
              
            <Route path="/verifypreuser" element={isAuth ? <PreusersList /> : <Navigate to="/" />} />
            <Route path="/elevate" element={isAuth ? <ElevateUsers /> : <Navigate to="/" />} />
            <Route path="/best" element={isAuth ? <Bestusers /> : <Navigate to="/" />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
