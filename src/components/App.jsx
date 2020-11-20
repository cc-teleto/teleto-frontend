import Logo from "./Logo";
import "../styles/styles.css"
import { useReducer } from "react";
import { currentViewReducer } from "../reducer/";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";
import Main from "./Main";

export default function App(props) {
  const [ currentView, currentViewDispatch ] = useReducer(currentViewReducer, props.currentView);
  return (
    <AppContext.Provider value={{
      currentView,
      currentViewDispatch
    }}>
      <div>
        <Logo />
        <Main />
      </div>
    </AppContext.Provider>
  )
}

App.defaultProps = {
  currentView: CURRENT_VIEW.START_FORM,
}