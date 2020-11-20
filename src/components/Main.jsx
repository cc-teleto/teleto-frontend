import { useContext } from "react";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerate from "./RandomGenerate";
import StartForm from "./StartForm";

export default function Main() {
  const topicFetchURL = getURL("/topics");
  const memberFetchURL = getURL("/members");
  const { currentView } = useContext(AppContext);
  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  } else {
    return (
      <div>
        <RandomGenerate
          title="話題"
          buttonTitle="話題切替"
          fetchURL={topicFetchURL}
        />
        <RandomGenerate
          title="話者"
          buttonTitle="話者切替"
          fetchURL={memberFetchURL}
        />
      </div>
    );
  }
}
