import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@material-ui/core";
import AppContext from "../context/AppContext";
import Winwheel from "../utils/Winwheel";
import "../styles/styles.css";
// import { getURL } from "../const";
import RouletteTopic from "./RouletteTopic";
import RouletteMember from "./RouletteMember";
import RouletteContext from "../context/RouletteContext";
import getRoomInfo from "../utils/webApi";
import Result from "./Result";

export default function Roulette() {
  // const ROOM_GET_URL = getURL("/room");
  const location = useLocation();
  const {
    // setMembers,
    setEndPeriod,
    setCategory,
    ws,
    rouletteMode,
  } = useContext(AppContext);

  const [loadingWheel, setLoadingWheel] = useState();

  const getRoom = async (grouphash) => {
    const data = await getRoomInfo(grouphash);
    console.log("DATA in Roulette:", data);
    setCategory(data.category);
    setEndPeriod(data.endPeriod);
  };

  useEffect(() => {
    if (ws) {
      const path = location.pathname.split("/");
      const data = {
        action: "sendhash",
        grouphash: path[2],
      };
      ws.send(JSON.stringify(data));
      console.log("send hash");
    }
  }, [ws]);

  useEffect(() => {
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
  }, [rouletteMode]);

  useEffect(() => {
    // 必要情報の取得
    const path = location.pathname.split("/");
    getRoom(path[2]);
  }, []);

  if (rouletteMode === "RESULT") {
    return <Result />;
  }
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
