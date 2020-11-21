import Logo from "./Logo";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";
import Main from "./Main";
import { useState } from "react";

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
      <div>
        <Logo />
        <Main />
      </div>
    </AppContext.Provider>
  );
}

App.defaultProps = {
  currentView: CURRENT_VIEW.START_FORM,
  period: "",
};
