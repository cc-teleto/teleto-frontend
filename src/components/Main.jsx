import React, { useEffect, useState, useContext } from "react";
import { Box, Drawer, Button } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import { CURRENT_VIEW, DEFAULT_CATEGORY, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerateTopic from "./RandomGenerateTopic";
import RandomGenerateMember from "./RandomGenerateMember";
import StartForm from "./StartForm";
import MembersList from "./MembersList";
import LogoWithText from "./LogoWithText";

export default function Main() {
  const {
    groupHash,
    currentView,
    category,
    mobileOpen,
    setMobileOpen,
  } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState("");
  const [memberFetchURL, setMemberFetchURL] = useState("");
  const [allMemberFetchURL, setAllMemberFetchURL] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
  // if (currentView === CURRENT_VIEW.ROULETTE) {
  //   return <Roulette />;
  // }
  if (currentView === CURRENT_VIEW.RANDOM_GENERATE) {
    return (
      <>
        <Box width="100%">
          <RandomGenerateMember fetchURL={memberFetchURL} />
          <RandomGenerateTopic fetchURL={topicFetchURL} />
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<PeopleIcon />}
            onClick={handleDrawerToggle}
            style={{
              backgroundColor: "#9fe4e2",
              fontSize: "15px",
            }}
          >
            参加者を変える
          </Button>
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <LogoWithText />
            <MembersList fetchURL={allMemberFetchURL} />
          </Drawer>
        </Box>
      </>
    );
  }
  return null;
}
