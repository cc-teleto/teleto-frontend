import React, { useState, useReducer } from "react";
import { Box } from "@material-ui/core";
import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";
import Main from "./Main";
import Message from "./Message";

// 参加者を保持するためのReducer
const membersReducer = (state, action) => {
  const newState = { ...state };
  switch (action.type) {
    case "add":
      newState.maxId = state.maxId + 1;
      newState.members[`member${state.maxId}`] = "";
      break;
    case "update":
      newState.members[action.key] = action.value;
      break;
    case "delete":
      delete newState.members[action.key];
      break;
    default:
      throw new Error(action.type, "is not found");
  }
  return newState;
};

export default function App() {
  const [currentView, setCurrentView] = useState(CURRENT_VIEW.START_FORM);
  const [period, setPeriod] = useState(-1);
  const [periodInput, setPeriodInput] = useState("");
  const [members, setMembers] = useReducer(membersReducer, {});
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
        periodInput,
        setPeriodInput,
        groupHash,
        setGroupHash,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Message period={period * 60} />
        <Logo />
        <Main />
      </Box>
    </AppContext.Provider>
  );
}
