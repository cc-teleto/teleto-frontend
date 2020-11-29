import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  // useParams,
  // useHistory,
  // useLocation,
} from "react-router-dom";
import { Box, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { DEFAULT_CATEGORY, CURRENT_VIEW } from "../const";
import Main from "./Main";
import Message from "./Message";
import Roulette from "./Roulette";

const theme = createMuiTheme({
  typography: {
    fontFamily: `"M PLUS Rounded 1c", sans-serif`,
  },
});

export default function App() {
  const initialMembers = {
    maxId: 1,
    members: {
      member1: "",
    },
  };
  const [currentView, setCurrentView] = useState(CURRENT_VIEW.START_FORM);
  const [period, setPeriod] = useState(-1);
  const [endPeriod, setEndPeriod] = useState("");
  const [members, setMembers] = useState(initialMembers);
  const [groupHash, setGroupHash] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedTalker, setSelectedTalker] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        period,
        setPeriod,
        endPeriod,
        setEndPeriod,
        members,
        setMembers,
        groupHash,
        setGroupHash,
        category,
        setCategory,
        mobileOpen,
        setMobileOpen,
        selectedTalker,
        setSelectedTalker,
        selectedTopic,
        setSelectedTopic,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Message period={period * 60} severity="" message="" />
          <Router>
            <Logo />
            <Switch>
              <Route path="/" exact>
                <Main />
              </Route>
              <Route path="/roulette/:id" exact>
                <Roulette />
              </Route>
            </Switch>
          </Router>
        </Box>
      </MuiThemeProvider>
    </AppContext.Provider>
  );
}
