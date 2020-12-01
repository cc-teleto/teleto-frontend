import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
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

export default function RouletteTopic() {
  const location = useLocation();
  const history = useHistory();
  const {
    category,
    ws,
    selectedTopic,
    setSelectedTopic,
    setCurrentView,
    selectedTalker,
    rouletteMode,
  } = useContext(AppContext);
  const { loadingWheel, setLoadingWheel } = useContext(RouletteContext);
  const [wheel, setWheel] = useState();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelStopped, setWheelStopped] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  const audio = new Audio("/tick.mp3");
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  console.log("Rendering RouletteTopic:", topics);

  // This function is called when the sound is to be played.
  function playSound() {
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
  }

  // for websocket
  function setNextView() {
    const path = location.pathname.split("/");
    const grouphash = path[2];
    setCurrentView(CURRENT_VIEW.RESULT);
    setWheel(undefined);
    history.push(`/result/${grouphash}`);
  }

  // Called when the animation has finished.
  function stopAction(indicatedSegment) {
    console.log("Topic:selectedTopic:", topicList);
    let resultTopic;
    topicList.forEach((topic) => {
      if (topic.keyword === indicatedSegment.text) {
        resultTopic = topic.topic;
      }
    });
    console.log("resultTopic:", resultTopic);
    setSelectedTopic(resultTopic);
    setWheelStopped(true);
    setTimeout(setNextView, 2000);
  }

  useEffect(() => {
    if (wheelStopped === true) {
      const data = {
        action: "stoproulette",
        roulette: "Topic",
        selectedTopic,
      };
      console.log("Topic:stop roulette");
      ws.send(JSON.stringify(data));
    }
  }, [wheelStopped]);

  useEffect(() => {
    console.log("Topic:=====wheelSpinning-useEffect Start=====");
    if (wheelSpinning === true) {
      console.log("Topic:*****wheelSpinning true*****");
      // Begin the spin animation by calling startAnimation on the wheel object.
      console.log(wheel);
      wheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      setWheelSpinning(false);
    }
  }, [wheelSpinning, wheel]);

  // ルーレット生成のためのトピックを取得し、ルーレット生成
  useEffect(() => {
    console.log("Topic:=====useEffect Start=====");
    const getTopicsParams = {
      action: "getmultitopics",
      category,
      num: 8,
    };
    ws.send(JSON.stringify(getTopicsParams));
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
        textFontSize: 12, // Font size.\
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
    console.log("Topic:=====ws-useEffect Start=====");
    console.log("Topic:ws", wheel);
    console.log("Topic:ws", ws);
    if (!ws) return;
    console.log("Topic:ws return済:");
    if (rouletteMode === "TOPIC") {
      ws.onmessage = (e) => {
        console.log("Topic:receiveData", e.data);
        const resData = JSON.parse(e.data);

        if (resData.action === "getmultitopics") {
          console.log("Topic:*****getmultitopics Start*****");
          setTopicList(resData.topics);
          const segmentList = resData.topics.map(function (value, index) {
            console.log(
              "Topic:topicList",
              value.topic.replace(/(?:[\w\s]{16})/g, "$&|\n")
            );
            
            const str = value.keyword.replace(/(?:[\w\s]{16})/g, "$&|\n");
            const a = str.slice(0,8);
            const b = str.slice(8);
            const repstr = a.concat('\n',b);
            return {
              fillStyle: colorList[index % colorList.length],
              text: repstr,
            };
          });

          console.log("Topic:*****segmentList*****");
          console.log(segmentList);
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
    console.log("Topic:start roulette");
    ws.send(JSON.stringify(data));
  }

  useEffect(() => {
    console.log("loadingWheel start");
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
        <Typography variant="h4" align="center">
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
