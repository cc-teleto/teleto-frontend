import React, { useEffect, useState, useContext } from "react";

import { CURRENT_VIEW, DEFAULT_CATEGORY, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerateTopic from "./RandomGenerateTopic";
import RandomGenerateMember from "./RandomGenerateMember";
import MembersList from "./MembersList";

import StartForm from "./StartForm";

export default function Main() {
  const { groupHash, currentView, category } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState("");
  const [memberFetchURL, setMemberFetchURL] = useState("");
  const [allMemberFetchURL, setAllMemberFetchURL] = useState("");

  useEffect(() => {
    let newTopicFetchURL = getURL("/topics", "/?random=true");
    const newMemberFetchURL = getURL("/members", "/?random=true");
    const newAllMemberFetchURL = getURL("/members", "/?random=false");

    if (category || category !== DEFAULT_CATEGORY) {
      newTopicFetchURL += `&category=${category}`;
    }

    const fetchURLs = {
      topicFetchURL: [newTopicFetchURL, setTopicFetchURL],
      memberFetchURL: [newMemberFetchURL, setMemberFetchURL],
      allMemberFetchURL: [newAllMemberFetchURL, setAllMemberFetchURL],
    };

    Object.values(fetchURLs).forEach(([url, setFetchURL]) => {
      let fetchURL = url;
      if (groupHash) {
        fetchURL += `&grouphash=${groupHash}`;
        setFetchURL(fetchURL);
      }
    });
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
