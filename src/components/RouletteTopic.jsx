import React, { useEffect, useState, useContext } from "react";
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

export default function RouletteTopic() {
  const {
    category,
    ws,
    selectedTopic,
    setSelectedTopic,
    setCurrentView,
    selectedTalker,
  } = useContext(AppContext);
  const [wheel, setWheel] = useState();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelStopped, setWheelStopped] = useState(false);
  const [topics, setTopics] = useState([]);
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  // const [topics, setTopics] = useState([]);
  const audio = new Audio("/tick.mp3");
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  // const loadingWheel = new Winwheel({
  //   canvasId: "loadingRoulette",
  //   numSegments: 4, // Number of segments
  //   pointerAngle: 135, // Ensure this is set correctly
  //   outerRadius: 165, // The size of the wheel.
  //   innerRadius: 50,
  //   centerX: 217, // Used to position on the background correctly.
  //   centerY: 222,
  //   strokeStyle: "#ffffff",
  //   lineWidth: 1,
  //   // textOrientation: "vertical",
  //   textFontSize: 18, // Font size.\
  //   rotationAngle: -360 / 4 / 2, // show the default position aligned to the text
  //   // Definition of all the segments.
  //   segments: [
  //     { fillStyle: "#eae56f", text: "Segment 1" },
  //     { fillStyle: "#89f26e", text: "Segment 2" },
  //     { fillStyle: "#7de6ef", text: "Segment 3" },
  //     { fillStyle: "#e7706f", text: "Segment 4" },
  //   ],
  //   // Specify pin parameters.
  //   pins: {
  //     number: 4,
  //     outerRadius: 6,
  //     margin: 3,
  //     fillStyle: "#47B7C1",
  //     strokeStyle: "#47B7C1",
  //   },
  //   animation: {
  //     type: "spinOngoing",
  //     duration: 5,
  //     spins: 8,
  //   },
  // });

  // console.log(loadingWheel);

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
    setCurrentView(CURRENT_VIEW.RESULT);
  }

  // Called when the animation has finished.
  function stopAction(indicatedSegment) {
    console.log(indicatedSegment.text);
    setSelectedTopic(indicatedSegment.text);
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
      console.log("stop roulette");
      ws.send(JSON.stringify(data));
    }
  }, [wheelStopped]);

  useEffect(() => {
    console.log("=====wheelSpinning-useEffect Start=====");
    if (wheelSpinning === true) {
      console.log("*****wheelSpinning true*****");
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
    console.log("=====useEffect Start=====");
    const getTopicsParams = {
      action: "getmultitopics",
      category,
      num: 8,
    };
    ws.send(JSON.stringify(getTopicsParams));
  }, []);

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
        textFontSize: 18, // Font size.\
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
    console.log("=====ws-useEffect Start=====");
    console.log(wheel);
    if (!ws) return;
    ws.onmessage = (e) => {
      console.log("Topic:receiveData", e.data);
      const resData = JSON.parse(e.data);

      // バックエンドバグ修正までコメントアウト
      if (resData.action === "getmultitopics") {
        console.log("*****getmultitopics Start*****");

        const segmentList = resData.topics.map(function (value, index) {
          console.log(value.topic.replace(/(?:[\w\s]{16})/g, "$&|\n"));
          return {
            fillStyle: colorList[index % colorList.length],
            text: value.keyword.replace(/(?:[\w\s]{16})/g, "$&|\n"),
          };
        });
        // const segmentList = [
        //   { fillStyle: "#eae56f", text: "c" },
        //   { fillStyle: "#89f26e", text: "b" },
        //   { fillStyle: "#7de6ef", text: "a" },
        // ];

        console.log("*****segmentList*****");
        console.log(segmentList);

        setTopics(segmentList);
      }

      if (resData.action === "startroulette") {
        if (resData.roulette === "Topic") {
          wheel.animation.stopAngle = resData.rouletteStopAt;
          setWheelSpinning(true);
        }
      }
    };
  }, [ws, wheel]);

  function handleOnClick() {
    const data = {
      action: "startroulette",
      roulette: "Topic",
    };
    console.log("start roulette");
    ws.send(JSON.stringify(data));
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Typography variant="h4" align="center">
          {selectedTalker}さんが話すお題は・・・
        </Typography>
      </ThemeProvider>
      {/* set className to show the background image */}
      {/* {wheel ?  */}
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
      {/* //  : 
      //   <>
      //     <div className="canvas_logo" width="438" height="582">
      //       <canvas id="loadingRoulette" width="434" height="434">
      //         {" "}
      //       </canvas>
      //     </div>
      //     <Button
      //       variant="contained"
      //       style={{
      //         backgroundColor: "#9fe4e2",
      //       }}
      //       disabled
      //     >
      //       START
      //     </Button>
      //   </>
      // }
      // ) */}
    </>
  );
}
