import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";
import Main from "./Main";
import { useState } from "react";
import { Box } from "@material-ui/core";
import Message from "./Message";
import { useReducer } from "react";

// 参加者を保持するためのReducer
const membersReducer = (state, action) => {
  switch (action.type) {
    case "add":
      state.maxId++;
      state.members[`member${state.maxId}`] = "";
      return Object.assign({}, state);
    case "update":
      state.members[action.key] = action.value;
      return Object.assign({}, state);
    case "delete":
      delete state.members[action.key];
      return Object.assign({}, state);
    default:
      console.log(action.type, "is not found");
  }
};

export default function App(props) {
  const [currentView, setCurrentView] = useState(props.currentView);
  const [period, setPeriod] = useState("");
  const [periodInput, setPeriodInput] = useState("");
  const [members, setMembers] = useReducer(membersReducer, props.members);
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

App.defaultProps = {
  currentView: CURRENT_VIEW.START_FORM,
  period: "",
  members: {
    maxId: 1,
    members: { member1: "" },
  },
};
