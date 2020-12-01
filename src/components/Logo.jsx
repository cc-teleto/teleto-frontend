import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Box } from "@material-ui/core";
import logoImage from "../img/logo.png";
import { CURRENT_VIEW } from "../const";
import AppContext from "../context/AppContext";

export default function Logo() {
  const {
    setCurrentView,
    setSelectedTalker,
    setSelectedTopic,
    setMembers,
  } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const initialMembers = {
    maxId: 1,
    members: {
      member1: "",
    },
  };

  const onClick = () => {
    setSelectedTalker("");
    setSelectedTopic("");
    setMembers(initialMembers);
    setCurrentView(CURRENT_VIEW.START_FORM);
    history.push("/");
  };
  return path === "roulette" ? (
    <Box justifyContent="center" display="flex">
      <input
        type="image"
        className="logo"
        src={logoImage}
        alt="logo"
        onClick={onClick}
        onKeyDown={onClick}
        width="50%"
        height="50%"
      />
    </Box>
  ) : (
    <Box justifyContent="center" display="flex">
      <input
        type="image"
        className="logo"
        src={logoImage}
        alt="logo"
        onClick={onClick}
        onKeyDown={onClick}
      />
    </Box>
  );
}
