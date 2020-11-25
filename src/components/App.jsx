import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";
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
      }}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <Message period={period * 60} severity="" message="" />
        <Logo />
        <Main />
      </Grid>
    </AppContext.Provider>
  );
}
