import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import AppContext from "../context/AppContext";
import Winwheel from "../utils/Winwheel";
import "../styles/styles.css";
import { CURRENT_VIEW } from "../const";
import RouletteContext from "../context/RouletteContext";
import getRoomInfo from "../utils/webApi";

function RouletteMember() {
  const location = useLocation();
  const {
    // members,
    selectedTalker,
    setSelectedTalker,
    selectedTopic,
    setCurrentView,
    ws,
    rouletteMode,
    setRouletteMode,
  } = useContext(AppContext);
  const { loadingWheel, setLoadingWheel } = useContext(RouletteContext);
  const [wheel, setWheel] = useState();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelStopped, setWheelStopped] = useState(false);
  const [members, setMembers] = useState({
    maxId: 1,
    members: {
      member1: "",
    },
  });
  const screenTransitionInterval = 3000;

  const audio = new Audio("/tick.mp3");
  const stopAudio = new Audio("/stop.mp3");
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  const grayColorList = {
    "#eae56f": "#6B6932",
    "#89f26e": "#407334",
    "#7de6ef": "#3A6C70",
    "#e7706f": "#693232",
  };
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  const getRoom = async (grouphash) => {
    const data = await getRoomInfo(grouphash);
    console.log("DATA in Member:", data);

    const getMembers = {
      maxId: 0,
      members: {},
    };
    data.members.forEach((member) => {
      getMembers.maxId += 1;
      getMembers.members[`member${member.memberorder + 1}`] = member.membername;
    });
    setMembers(getMembers);
  };

  // for websocket
  function setMode(mode) {
    setWheel(undefined);
    setRouletteMode(mode);
  }

  // Called when the animation has finished.
  function stopAction(indicatedSegment) {
    // Set the result and move to next screen
    if (selectedTopic) {
      console.log("detect topic already set");
      setSelectedTalker(indicatedSegment.text);
      setWheelStopped(true);
      setTimeout(setCurrentView, screenTransitionInterval, CURRENT_VIEW.RESULT);
      setTimeout(setRouletteMode, screenTransitionInterval, "RESULT");
    } else {
      console.log(indicatedSegment.text);
      setSelectedTalker(indicatedSegment.text);
      setWheelStopped(true);
      setTimeout(setMode, screenTransitionInterval, "TOPIC");
      console.log(setRouletteMode);
    }
  }

  useEffect(() => {
    if (wheelStopped === true) {
      // Highlight the selected segmanet and gray out the others
      console.log("Human:=====wheel stopped=====");
      console.log(wheel);
      const winningSegmentNumber = wheel.getIndicatedSegmentNumber();
      for (let x = 1; x < wheel.segments.length; x += 1) {
        if (x !== winningSegmentNumber) {
          wheel.segments[x].fillStyle =
            // "gray";
            grayColorList[wheel.segments[x].fillStyle];
        }
      }
      wheel.draw();
      stopAudio.play();

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
    console.log("loadingWheel start");
    if (loadingWheel) loadingWheel.startAnimation();
  }, [loadingWheel]);

  useEffect(() => {
    const segmentList = Object.values(members.members).map(function (
      value,
      index
    ) {
      return { fillStyle: colorList[index % colorList.length], text: value };
    });

    console.log(segmentList);

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

  useEffect(() => {
    if (!ws) return;
    console.log("Human:ws return済:");
    console.log("Human:rouletteMode", rouletteMode);
    if (rouletteMode === "HUMAN") {
      ws.onmessage = (e) => {
        console.log("Human:receiveData", e.data);
        const resData = JSON.parse(e.data);

        if (resData.action === "startroulette") {
          if (resData.roulette === "Talker") {
            wheel.animation.stopAngle = resData.rouletteStopAt;
            setWheelSpinning(true);
          }
        }
      };
    }
  }, [ws, wheel]);

  useEffect(() => {
    const path = location.pathname.split("/");
    getRoom(path[2]);
  }, []);

  function handleOnClick() {
    const data = {
      action: "startroulette",
      roulette: "Talker",
    };
    console.log("start roulette");
    ws.send(JSON.stringify(data));
  }

  function checkMemberLoad() {
    const initialMembers = {
      maxId: 1,
      members: {
        member1: "",
      },
    };

    // String化して比較
    const initialMembersJson = JSON.stringify(
      Object.entries(initialMembers).sort()
    );
    const currentMembersJson = JSON.stringify(Object.entries(members).sort());

    console.log(initialMembersJson);
    console.log(currentMembersJson);
    console.log("check:", initialMembersJson !== currentMembersJson);

    if (initialMembersJson !== currentMembersJson) {
      if (loadingWheel) {
        loadingWheel.stopAnimation();

        // （おそらく）複数のwheelを管理した状態だとアニメーションの描画に失敗するため削除
        setLoadingWheel(undefined);
      }
      return true;
    }
    return false;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Typography variant="h4" align="center">
          話すひとは・・・
        </Typography>
      </ThemeProvider>
      {/* set className to show the background image */}
      {checkMemberLoad() ? (
        <>
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
        <div className="canvas_logo" width="438" height="582">
          <canvas id="loadingRoulette" width="434" height="434">
            {" "}
          </canvas>
        </div>
      )}
    </>
  );
}

export default RouletteMember;
