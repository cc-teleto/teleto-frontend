import React, { useEffect, useState, useContext } from "react";

import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerateTopic from "./RandomGenerateTopic";
import RandomGenerateMember from "./RandomGenerateMember";
import MembersList from "./MembersList";

import StartForm from "./StartForm";

export default function Main() {
  const { groupHash, currentView, category } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState("");
  const [memberFetchURL, setMemberFetchURL] = useState("");
  const [allMemberFetchURL, setAllMemberFetchURL] = useState();

  useEffect(() => {
    if (groupHash && category) {
      setTopicFetchURL(
        getURL(
          "/topics",
          `/?random=true&grouphash=${groupHash}&category=${category}`
        )
      );
      setMemberFetchURL(
        getURL("/members", `/?random=true&grouphash=${groupHash}`)
      );
      setAllMemberFetchURL(
        getURL("/members", `/?random=false&grouphash=${groupHash}`)
      );
    }
  }, [groupHash, category]);

  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  }
  if (currentView === CURRENT_VIEW.RANDOM_GENERATE) {
    return (
      <>
        <RandomGenerateTopic fetchURL={topicFetchURL} />
        <RandomGenerateMember fetchURL={memberFetchURL} />
        <MembersList fetchURL={allMemberFetchURL} />
      </>
    );
  }
  return null;
}
