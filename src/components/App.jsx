import React, { useState } from "react";
import { Box, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { DEFAULT_CATEGORY, CURRENT_VIEW } from "../const";
import Main from "./Main";
import Message from "./Message";

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
  const [members, setMembers] = useState(initialMembers);
  const [groupHash, setGroupHash] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        period,
        setPeriod,
        members,
        setMembers,
        groupHash,
        setGroupHash,
        category,
        setCategory,
        mobileOpen,
        setMobileOpen,
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
          <Logo />
          <Main />
        </Box>
      </MuiThemeProvider>
    </AppContext.Provider>
  );
}
