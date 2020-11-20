import { useContext } from "react";
import { CURRENT_VIEW } from "../const";
import AppContext from "../context/AppContext";
import StartForm from "./StartForm";

export default function Main() {
  const { currentView } = useContext(AppContext);
  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  }
}
