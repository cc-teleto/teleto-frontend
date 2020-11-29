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

export default function RouletteTopic() {
  const { category, ws } = useContext(AppContext);
  const [wheel, setWheel] = useState();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const audio = new Audio("/tick.mp3");
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  // This function is called when the sound is to be played.
  function playSound() {
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
  }

  // Called when the animation has finished.
  function stopAction(indicatedSegment) {
    console.log(indicatedSegment.text);
    const data = {
      action: "stoproulette",
      roulette: "Talker",
      selectedTalker: indicatedSegment.text,
    };
    console.log("stop roulette");
    ws.send(JSON.stringify(data));
  }

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

  // ルーレット生成のためのトピックを取得し、ルーレット生成
  useEffect(() => {
    const getTopicsParams = {
      action: "getmultitopics",
      category,
      num: 8,
    };
    ws.send(JSON.stringify(JSON.stringify(getTopicsParams)));
  }, []);

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (e) => {
      console.log("receiveData", e.data);
      const resData = JSON.parse(e.data);

      if (resData.action === "getmultitopics") {
        const segmentList = Object.values(resData.topics).map(function (
          value,
          index
        ) {
          return {
            fillStyle: colorList[index % colorList.length],
            text: value,
          };
        });

        const itemNumber = Object.values(e.data.data).length;

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
      } else if (resData.action === "startroulette") {
        if (resData.roulette === "Topic") {
          wheel.animation.stopAngle = e.data;
          setWheelSpinning(true);
        }
      }
    };
  }, [ws]);

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
          お題は・・・
        </Typography>
      </ThemeProvider>
      {/* set className to show the background image */}
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
  );
}
