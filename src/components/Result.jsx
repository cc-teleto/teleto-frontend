import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Box, Drawer, Button } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import { CURRENT_VIEW, DEFAULT_CATEGORY, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerateTopic from "./RandomGenerateTopic";
import RandomGenerateMember from "./RandomGenerateMember";
import MembersList from "./MembersList";
import LogoWithText from "./LogoWithText";
import getRoomInfo from "../utils/webApi";

export default function Result() {
  const location = useLocation();
  const history = useHistory();
  const {
    groupHash,
    currentView,
    category,
    mobileOpen,
    setMobileOpen,
    setSelectedTopic,
    setCurrentView,
    setRouletteMode,
    setSelectedTalker,
    ws,
  } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState("");
  const [memberFetchURL, setMemberFetchURL] = useState("");
  const [allMemberFetchURL, setAllMemberFetchURL] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const setBasicInfo = async (grouphash) => {
    const data = await getRoomInfo(grouphash);
    console.log("DATA in Roulette:", data);

    setSelectedTopic(data.selectedTopic);
    setSelectedTalker(data.selectedTalker);
  };

  useEffect(() => {
    const path = location.pathname.split("/");
    setBasicInfo(path[2]);
  }, []);

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

  useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        console.log("changeresult data:", e.data);
        const resData = JSON.parse(e.data);
        const path = location.pathname.split("/");
        const grouphash = path[2];

        if (resData.action === "changeresult") {
          if (resData.roulette === "Talker") {
            setCurrentView(CURRENT_VIEW.ROULETTE);
            setRouletteMode("HUMAN");
            history.push(`/roulette/${grouphash}`);
          } else if (resData.roulette === "Topic") {
            setCurrentView(CURRENT_VIEW.ROULETTE);
            setRouletteMode("TOPIC");
            history.push(`/roulette/${grouphash}`);
          } else if (resData.roulette === "Both") {
            setCurrentView(CURRENT_VIEW.ROULETTE);
            setRouletteMode("HUMAN");
            setSelectedTopic("");
            history.push(`/roulette/${grouphash}`);
          }
        }
      };
    }
  }, [ws, currentView]);

  function handlerOnClickForBothChange() {
    if (ws) {
      const data = {
        action: "changeresult",
        roulette: "Both",
      };
      console.log("ws changeresult Both");
      ws.send(JSON.stringify(data));
    }
  }

  return (
    <>
      <Box width="100%">
        <RandomGenerateMember fetchURL={memberFetchURL} />
        <RandomGenerateTopic fetchURL={topicFetchURL} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        m={3}
      >
        <Button
          variant="contained"
          startIcon={<PeopleIcon />}
          onClick={handlerOnClickForBothChange}
          style={{
            backgroundColor: "#E3C188",
            fontSize: "15px",
          }}
        >
          両方チェンジ！
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        m={5}
      >
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
