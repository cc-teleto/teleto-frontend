import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";
import Main from "./Main";
import { useState } from "react";
import { Box } from "@material-ui/core";

export default function App(props) {
  const [currentView, setCurrentView] = useState(props.currentView);
  const [period, setPeriod] = useState("");
  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        period,
        setPeriod,
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Logo />
        <Main />
      </Box>
    </AppContext.Provider>
  );
}

App.defaultProps = {
  currentView: CURRENT_VIEW.START_FORM,
  period: "",
};
