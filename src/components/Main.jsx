import React, { useEffect, useState, useContext } from "react";

import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerate from "./RandomGenerate";
import MembersList from "./MembersList";
import StartForm from "./StartForm";

export default function Main() {
  const { groupHash, currentView } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState("");
  const [memberFetchURL, setMemberFetchURL] = useState("");
  const [allMemberFetchURL, setAllMemberFetchURL] = useState();

  useEffect(() => {
    if (groupHash) {
      setTopicFetchURL(
        getURL("/topics", `/?random=true&grouphash=${groupHash}`)
      );
      setMemberFetchURL(
        getURL("/members", `/?random=true&grouphash=${groupHash}`)
      );
      setAllMemberFetchURL(
        getURL("/members", `/?random=false&grouphash=${groupHash}`)
      );
    }
  }, [groupHash]);

  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  }
  if (currentView === CURRENT_VIEW.RANDOM_GENERATE) {
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
        <MembersList
          fetchURL={allMemberFetchURL}
        />
      </>
    );
  }
  return null;
}
