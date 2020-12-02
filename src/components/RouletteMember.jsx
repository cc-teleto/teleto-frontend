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
  const event = "touchend";
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
  const isiPhone = navigator.userAgent.indexOf("iPhone") > 0;
  /*
  以下の文字列でユーザーエージェントを判別します
  osVer = "iPhone";
  osVer = "Android";
  osVer = "iPod";
  osVer = "iPad";
  */
  let audio;
  let stopAudio;
  if (!isiPhone) {
    audio = new Audio("/tick.mp3");
    stopAudio = new Audio("/stop.mp3");
    document.addEventListener(event, function () {
      // 事前に音源をロードする
      audio.load("/tick.mp3");
      stopAudio.load("/stop.mp3");

      stopAudio.pause();
      stopAudio.currentTime = 0;
    });
  }

  const colorList = ["#9FE4E2", "#E3B8B6", "#AAC7E3", "#E3C188"];
  const grayColorList = {
    "#9FE4E2": "#7BB0AE",
    "#E3B8B6": "#B08F8D",
    "#AAC7E3": "#849BB0",
    "#E3C188": "#B0966A",
  };
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  async function playAudio(audios) {
    try {
      await audios.play();
    } catch (err) {
      console.log(err);
    }
  }

  const getRoom = async (grouphash) => {
    const data = await getRoomInfo(grouphash);

    const membersInfo = {
      maxId: 0,
      members: {},
    };
    data.members.forEach((member, index) => {
      membersInfo.maxId += 1;
      membersInfo.members[`member${index + 1}`] = member.membername;
    });
    setMembers(membersInfo);
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
      setSelectedTalker(indicatedSegment.textOriginal);
      setWheelStopped(true);
      setTimeout(setCurrentView, screenTransitionInterval, CURRENT_VIEW.RESULT);
      setTimeout(setRouletteMode, screenTransitionInterval, "RESULT");
    } else {
      setSelectedTalker(indicatedSegment.textOriginal);
      setWheelStopped(true);
      setTimeout(setMode, screenTransitionInterval, "TOPIC");
    }
  }

  useEffect(() => {
    if (wheelStopped === true) {
      // Highlight the selected segmanet and gray out the others
      const winningSegmentNumber = wheel.getIndicatedSegmentNumber();
      for (let x = 1; x < wheel.segments.length; x += 1) {
        if (x !== winningSegmentNumber) {
          wheel.segments[x].fillStyle =
            // "gray";
            grayColorList[wheel.segments[x].fillStyle];
        }
      }
      wheel.draw();

      if (!isiPhone) {
        playAudio(stopAudio);
      }

      const data = {
        action: "stoproulette",
        roulette: "Talker",
        selectedTalker,
      };
      ws.send(JSON.stringify(data));
    }
  }, [wheelStopped]);

  useEffect(() => {
    if (loadingWheel) loadingWheel.startAnimation();
  }, [loadingWheel]);

  useEffect(() => {
    const segmentList = Object.values(members.members).map(function (
      value,
      index
    ) {
      let repstr = "";
      let fontSize = 15;
      if (value.length > 7) {
        const a = value.slice(0, 6);
        const b = value.slice(6);
        repstr = a.concat("\n", b);
        if (value.length > 12) {
          const c = repstr.slice(0, 12);
          repstr = c.concat("\n", "...");
          fontSize = 13;
        }
      } else {
        repstr = value;
      }
      return {
        fillStyle: colorList[index % colorList.length],
        text: repstr,
        textFontSize: fontSize,
        textOriginal: value,
      };
    });

    // This function is called when the sound is to be played.
    function playSound() {
      if (!isiPhone) {
        // Stop and rewind the sound if it already happens to be playing.
        audio.pause();
        audio.currentTime = 0;
        // Play the sound.
        playAudio(audio);
      }
    }

    const itemNumber = Object.values(members.members).length;

    setWheel(
      new Winwheel({
        canvasId: "myCanvas",
        numSegments: itemNumber, // Number of segments
        pointerAngle: 131, // Ensure this is set correctly
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
      wheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      setWheelSpinning(false);
    }
  }, [wheelSpinning]);

  useEffect(() => {
    if (!ws) return;
    if (rouletteMode === "HUMAN") {
      ws.onmessage = (e) => {
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
