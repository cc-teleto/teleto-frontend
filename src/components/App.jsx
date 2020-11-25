import React, { useState } from "react";
import { Box } from "@material-ui/core";
import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { DEFAULT_CATEGORY, CURRENT_VIEW } from "../const";
import Main from "./Main";
import Message from "./Message";

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
      }}
    >
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
    </AppContext.Provider>
  );
}
