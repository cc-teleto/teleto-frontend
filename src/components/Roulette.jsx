import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@material-ui/core";
import AppContext from "../context/AppContext";
import Winwheel from "../utils/Winwheel";
import "../styles/styles.css";
import { getURL } from "../const";
import RouletteTopic from "./RouletteTopic";
import RouletteMember from "./RouletteMember";
import RouletteContext from "../context/RouletteContext";

export default function Roulette() {
  const ROOM_GET_URL = getURL("/room");
  const location = useLocation();
  const {
    setMembers,
    setEndPeriod,
    setCategory,
    setWs,
    rouletteMode,
  } = useContext(AppContext);

  const [loadingWheel, setLoadingWheel] = useState();

  const getRoom = async (grouphash) => {
    const strURL = `${ROOM_GET_URL}?grouphash=${grouphash}`;
    const res = await fetch(strURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    const data = await res.json();
    console.log("strURL:", strURL);
    console.log("DATA:", data);

    const getMembers = {
      maxId: 0,
      members: {},
    };

    data.members.forEach((member) => {
      getMembers.maxId += 1;
      getMembers.members[`member${member.memberorder + 1}`] = member.membername;
    });
    setMembers(getMembers);
    setCategory(data.category);
    setEndPeriod(data.endPeriod);
  };

  // for websocket
  useEffect(() => {
    const path = location.pathname.split("/");
    const wsClient = new WebSocket(
      "wss://jjfbo951m5.execute-api.us-east-1.amazonaws.com/Prod"
    );
    wsClient.onopen = () => {
      console.log("ws opened");
      const data = {
        action: "sendhash",
        grouphash: path[2],
      };
      wsClient.send(JSON.stringify(data));
      console.log("send hash");
      setWs(wsClient);
    };
    wsClient.onclose = () => console.log("ws closed");

    setLoadingWheel(
      new Winwheel({
        canvasId: "loadingRoulette",
        numSegments: 3, // Number of segments
        pointerAngle: 135, // Ensure this is set correctly
        outerRadius: 165, // The size of the wheel.
        innerRadius: 50,
        centerX: 217, // Used to position on the background correctly.
        centerY: 222,
        strokeStyle: "#ffffff",
        lineWidth: 1,
        textOrientation: "curved",
        textAligment: "center",
        textFontSize: 30, // Font size.\
        rotationAngle: -360 / 3 / 2, // show the default position aligned to the text
        // Definition of all the segments.
        segments: [
          { fillStyle: "#E3B8B6", text: "ル ー レ ッ ト" },
          { fillStyle: "#9FE4E2", text: "読 み 込 み 中" },
          { fillStyle: "#E3C188", text: "！ ！ ！" },
        ],
        // Specify pin parameters.
        pins: {
          number: 3,
          outerRadius: 6,
          margin: 3,
          fillStyle: "#47B7C1",
          strokeStyle: "#47B7C1",
        },
        animation: {
          type: "spinOngoing",
          duration: 1000,
          spins: 100,
          easing: "Linear.easeNone",
          direction: "anti-clockwise",
          repeat: -1,
        },
      })
    );

    // 必要情報の取得
    getRoom(path[2]);

    return () => {
      wsClient.close();
    };
  }, []);

  return (
    <RouletteContext.Provider
      value={{
        loadingWheel,
        setLoadingWheel,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {rouletteMode === "HUMAN" ? <RouletteMember /> : <RouletteTopic />}
      </Box>
    </RouletteContext.Provider>
  );
}
