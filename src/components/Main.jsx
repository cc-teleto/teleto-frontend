import { useContext } from "react";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerate from "./RandomGenerate";
import StartForm from "./StartForm";


export default function Main() {
  const { groupHash, currentView } = useContext(AppContext);
  const topicFetchURL = getURL("/topics", `/?random=true&grouphash=${groupHash}`);
  const memberFetchURL = getURL("/members", `/?random=true&grouphash=${groupHash}`);
  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  } else {
    return (
      <>
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
      </>
    )
  }
}
