import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import AppContext from "../context/AppContext";
import Winwheel from "../utils/Winwheel";
import "../styles/styles.css";
import { getURL } from "../const";
import RouletteTopic from "./RouletteTopic";

export default function Roulette() {
  const ROOM_GET_URL = getURL("/room");
  const location = useLocation();
  const {
    members,
    setMembers,
    setEndPeriod,
    setCategory,
    selectedTalker,
    setSelectedTalker,
    ws,
    setWs,
  } = useContext(AppContext);
  const [wheel, setWheel] = useState();
  const [rouletteMode, setRouletteMode] = useState("HUMAN");
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelStopped, setWheelStopped] = useState(false);
  const audio = new Audio("/tick.mp3");
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  // for websocket

  function setMode(mode) {
    setRouletteMode(mode);
  }

  // Called when the animation has finished.
  function stopAction(indicatedSegment) {
    console.log(indicatedSegment.text);
    setSelectedTalker(indicatedSegment.text);
    setWheelStopped(true);
    setTimeout(setMode, 2000, "TOPIC");
    console.log(setRouletteMode);
  }

  useEffect(() => {
    if (wheelStopped === true) {
      const data = {
        action: "stoproulette",
        roulette: "Talker",
        selectedTalker,
      };
      console.log("stop roulette");
      ws.send(JSON.stringify(data));
    }
  }, [wheelStopped]);

  useEffect(() => {
    const segmentList = Object.values(members.members).map(function (
      value,
      index
    ) {
      return { fillStyle: colorList[index % colorList.length], text: value };
    });

    // This function is called when the sound is to be played.
    function playSound() {
      // Stop and rewind the sound if it already happens to be playing.
      audio.pause();
      audio.currentTime = 0;

      // Play the sound.
      audio.play();
    }

    const itemNumber = Object.values(members.members).length;

    setWheel(
      new Winwheel({
        canvasId: "myCanvas",
        numSegments: itemNumber, // Number of segments
        pointerAngle: 135, // Ensure this is set correctly
        outerRadius: 165, // The size of the wheel.
        innerRadius: 50,
        centerX: 217, // Used to position on the background correctly.
        centerY: 222,
        strokeStyle: "#ffffff",
        lineWidth: 1,
        // textOrientation: "vertical",
        textFontSize: 18, // Font size.\
        rotationAngle: -360 / itemNumber / 2, // show the default position aligned to the text
        // Definition of all the segments.
        segments: segmentList,
        // Specify pin parameters.
        pins: {
          number: itemNumber,
          outerRadius: 6,
          margin: 3,
          fillStyle: "#47B7C1",
          strokeStyle: "#47B7C1",
        },
        animation: {
          type: "spinToStop",
          duration: 5,
          spins: 8,
          callbackFinished: stopAction,
          callbackSound: playSound, // Function to call when the tick sound is to be triggered.
          soundTrigger: "pin",
        },
      })
    );
  }, [members.maxId]);

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

  useEffect(() => {
    if (wheelSpinning === true) {
      // Begin the spin animation by calling startAnimation on the wheel object.
      console.log(wheel);
      wheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      setWheelSpinning(false);
    }
  }, [wheelSpinning]);

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
    getRoom(path[2]);

    return () => {
      wsClient.close();
    };
  }, []);

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (e) => {
      console.log("receiveData", e.data);
      const resData = JSON.parse(e.data);

      if (resData.action === "startroulette") {
        if (resData.roulette === "Talker") {
          wheel.animation.stopAngle = resData.rouletteStopAt;
          setWheelSpinning(true);
        }
      }
    };
  }, [ws]);

  function handleOnClick() {
    const data = {
      action: "startroulette",
      roulette: "Talker",
    };
    console.log("start roulette");
    ws.send(JSON.stringify(data));
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {rouletteMode === "HUMAN" ? (
        <>
          <ThemeProvider theme={theme}>
            <Typography variant="h4" align="center">
              話すひとは・・・
            </Typography>
          </ThemeProvider>
          {/* set className to show the background image */}
          <div className="canvas_logo" width="438" height="582">
            <canvas id="myCanvas" width="434" height="434">
              {" "}
            </canvas>
          </div>
          <Button
            variant="contained"
            onClick={() => handleOnClick()}
            style={{
              backgroundColor: "#9fe4e2",
            }}
          >
            START
          </Button>
        </>
      ) : (
        <RouletteTopic ws={ws} setWs={setWs} />
      )}
    </Box>
  );
}
