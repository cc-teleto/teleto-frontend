import React, { useEffect, useState, useContext } from "react";
import { Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import AppContext from "../context/AppContext";
import Winwheel from "../utils/Winwheel";
import "../styles/styles.css";
import { CURRENT_VIEW } from "../const";
import RouletteContext from "../context/RouletteContext";
import getRoomInfo from "../utils/webApi";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.only("xs")]: {
      width: "70%",
      height: "auto !important",
    },
  },
}));

export default function RouletteTopic() {
  const location = useLocation();
  const event = "touchend";
  const classes = useStyles();
  const {
    category,
    ws,
    selectedTopic,
    setSelectedTopic,
    setCurrentView,
    selectedTalker,
    rouletteMode,
    setRouletteMode,
    setSelectedTalker,
  } = useContext(AppContext);
  const { loadingWheel, setLoadingWheel } = useContext(RouletteContext);
  const [wheel, setWheel] = useState();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelStopped, setWheelStopped] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const colorList = ["#9FE4E2", "#E3B8B6", "#AAC7E3", "#E3C188"];
  const grayColorList = {
    "#9FE4E2": "#7BB0AE",
    "#E3B8B6": "#B08F8D",
    "#AAC7E3": "#849BB0",
    "#E3C188": "#B0966A",
  };
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
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  async function playAudio(audios) {
    try {
      await audios.play();
    } catch (err) {
      console.log(err);
    }
  }

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

  // for websocket
  function setNextView() {
    setCurrentView(CURRENT_VIEW.RESULT);
    setWheel(undefined);
    setRouletteMode("RESULT");
  }

  // Called when the animation has finished.
  function stopAction(indicatedSegment) {
    let resultTopic;
    topicList.forEach((topic) => {
      if (topic.keyword === indicatedSegment.text) {
        resultTopic = topic.topic;
      }
    });
    setSelectedTopic(resultTopic);
    setWheelStopped(true);
    setTimeout(setNextView, screenTransitionInterval);
  }

  const setSelectedTalkerInfo = async (grouphash) => {
    const data = await getRoomInfo(grouphash);

    setSelectedTalker(data.selectedTalker);
  };

  useEffect(() => {
    if (!selectedTalker) {
      const path = location.pathname.split("/");
      setSelectedTalkerInfo(path[2]);
    }
  }, []);

  useEffect(() => {
    if (wheelStopped === true) {
      // Highlight the selected segmanet and gray out the others
      const winningSegmentNumber = wheel.getIndicatedSegmentNumber();
      for (let x = 1; x < wheel.segments.length; x += 1) {
        if (x !== winningSegmentNumber) {
          wheel.segments[x].fillStyle =
            grayColorList[wheel.segments[x].fillStyle];
        }
      }
      wheel.draw();

      if (!isiPhone) {
        playAudio(stopAudio);
      }
      const data = {
        action: "stoproulette",
        roulette: "Topic",
        selectedTopic,
      };
      ws.send(JSON.stringify(data));
    }
  }, [wheelStopped]);

  useEffect(() => {
    if (wheelSpinning === true) {
      // Begin the spin animation by calling startAnimation on the wheel object.
      wheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      setWheelSpinning(false);
    }
  }, [wheelSpinning, wheel]);

  // ルーレット生成のためのトピックを取得し、ルーレット生成
  useEffect(() => {
    const getTopicsParams = {
      action: "getmultitopics",
      category,
      num: 8,
    };
    if (ws) ws.send(JSON.stringify(getTopicsParams));
  }, [ws]);

  useEffect(() => {
    const itemNumber = topics.length;
    setWheel(
      new Winwheel({
        canvasId: "topicRoulette",
        numSegments: itemNumber, // Number of segments
        pointerAngle: 135, // Ensure this is set correctly
        outerRadius: 165, // The size of the wheel.
        innerRadius: 50,
        centerX: 217, // Used to position on the background correctly.
        centerY: 222,
        strokeStyle: "#ffffff",
        lineWidth: 1,
        // textOrientation: "vertical",
        textFontSize: 15, // Font size.\
        textMargin: 0, // margin between the inner or outer of the wheel
        rotationAngle: -360 / itemNumber / 2, // show the default position aligned to the text
        // Definition of all the segments.
        segments: topics,
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
  }, [topics.length, topics]);

  useEffect(() => {
    if (!ws) return;
    if (rouletteMode === "TOPIC") {
      ws.onmessage = (e) => {
        const resData = JSON.parse(e.data);

        if (resData.action === "getmultitopics") {
          setTopicList(resData.topics);
          const segmentList = resData.topics.map(function (value, index) {
            const str = value.keyword.replace(/(?:[\w\s]{16})/g, "$&|\n");
            let repstr = "";
            let fontSize = 15;
            if (str.length > 7) {
              const a = str.slice(0, 6);
              const b = str.slice(6);
              repstr = a.concat("\n", b);
              if (repstr.length > 13) {
                const c = repstr.slice(0, 13);
                repstr = c.concat("\n", "...");
                fontSize = 13;
              }
            } else {
              repstr = str;
            }
            resData.topics[index].keyword = repstr;

            return {
              fillStyle: colorList[index % colorList.length],
              text: repstr,
              textFontSize: fontSize,
              textOriginal: str,
            };
          });

          // setTopics([]);
          setTopics(segmentList);
        }

        if (resData.action === "startroulette") {
          if (resData.roulette === "Topic") {
            wheel.animation.stopAngle = resData.rouletteStopAt;
            setWheelSpinning(true);
          }
        }
      };
    }
  }, [ws, wheel]);

  function handleOnClick() {
    const data = {
      action: "startroulette",
      roulette: "Topic",
    };

    ws.send(JSON.stringify(data));
  }

  useEffect(() => {
    if (loadingWheel) loadingWheel.startAnimation();
  }, [loadingWheel]);

  function checkTopicLoad() {
    if (topics.length !== 0) {
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
        <Typography variant="h4" align="center" className={classes.root}>
          {selectedTalker}さんが話すお題は・・・
        </Typography>
      </ThemeProvider>
      {/* set className to show the background image */}
      {checkTopicLoad() ? (
        <>
          <div className="canvas_logo" width="438" height="582">
            <canvas id="topicRoulette" width="434" height="434">
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
