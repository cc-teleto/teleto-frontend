import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import logoImage from "../img/logo.png";
import { CURRENT_VIEW } from "../const";
import AppContext from "../context/AppContext";

export default function Logo() {
  const { setCurrentView } = useContext(AppContext);
  const onClick = () => {
    setCurrentView(CURRENT_VIEW.START_FORM);
  };
  return (
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
