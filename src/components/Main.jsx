import { useEffect, useState } from "react";
import { useContext } from "react";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerateTopic from "./RandomGenerateTopic";
import RandomGenerateMember from "./RandomGenerateMember";
import StartForm from "./StartForm";

export default function Main() {
  const { groupHash, currentView } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState();
  const [memberFetchURL, setMemberFetchURL] = useState();

  useEffect(() => {
    setTopicFetchURL(getURL("/topics", `/?random=true&grouphash=${groupHash}`));
    setMemberFetchURL(getURL("/members", `/?random=true&grouphash=${groupHash}`));
  }, [groupHash]);

  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  } else {
    return (
      <>
        <RandomGenerateTopic fetchURL={topicFetchURL} />
        <RandomGenerateMember fetchURL={memberFetchURL} />
      </>
    );
  }
}
