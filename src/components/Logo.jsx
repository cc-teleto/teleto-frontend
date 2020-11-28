import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import { Box } from "@material-ui/core";
import logoImage from "../img/logo.png";
import { CURRENT_VIEW } from "../const";
import AppContext from "../context/AppContext";

export default function Logo() {
  const { setCurrentView } = useContext(AppContext);
  const history = useHistory();

  console.log("/////////////LOGO:historyのログ///////////");   
  console.log(history);

  const onClick = () => {
    setCurrentView(CURRENT_VIEW.START_FORM);
    console.log("/////////////LOGO:onclick historyのログ///////////");   
    console.log(history);
    history.push('/');
    console.log(history);
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
