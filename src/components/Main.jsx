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
  const [allMemberFetchURL, setAllMemberFetchURL] = useState();

  useEffect(() => {
    const fetchURLs = {
      topicFetchURL: [getURL("/topics", "/?random=true"), setTopicFetchURL],
      memberFetchURL: [getURL("/members", "/?random=true"), setMemberFetchURL],
      allMemberFetchURL: [
        getURL("/members", "/?random=false"),
        setAllMemberFetchURL,
      ],
    };

    Object.values(fetchURLs).forEach(([url, setFetchURL]) => {
      let fetchURL = url;
      if (groupHash) {
        fetchURL += `&grouphash=${groupHash}`;
      }
      if (category || category !== DEFAULT_CATEGORY) {
        fetchURL += `&category=${category}`;
      }
      setFetchURL(fetchURL);
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
