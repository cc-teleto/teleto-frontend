import React, { useEffect, useState, useContext } from "react";
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

export default function Roulette() {
  const { members } = useContext(AppContext);
  const [wheel, setWheel] = useState();
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const audio = new Audio("/tick.mp3");
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  // Called when the animation has finished.
  function alertPrize(indicatedSegment) {
    // Do basic alert of the segment text.
    alert(String(indicatedSegment.text));
  }

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
        outerRadius: 165, // The size of the wheel.
        innerRadius: 50,
        centerX: 217, // Used to position on the background correctly.
        centerY: 222,
        textOrientation: "vertical",
        textFontSize: 18, // Font size.\
        rotationAngle: -360 / itemNumber / 2, // show the default position aligned to the text
        // Definition of all the segments.
        segments: segmentList,
        // Specify pin parameters.
        pins: {
          number: itemNumber,
          outerRadius: 6,
          margin: 3,
          fillStyle: "#ffffff",
          strokeStyle: "#000000",
        },
        animation: {
          type: "spinToStop",
          duration: 5,
          spins: 8,
          callbackFinished: alertPrize,
          callbackSound: playSound, // Function to call when the tick sound is to be triggered.
          soundTrigger: "pin",
        },
      })
    );
  }, [members.maxId]);

  // -------------------------------------------------------
  // Click handler for spin button.
  // -------------------------------------------------------
  function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning === false) {
      // Begin the spin animation by calling startAnimation on the wheel object.
      wheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      setWheelSpinning(true);
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <ThemeProvider theme={theme}>
        <Typography variant="h4" align="center">
          話すひとは・・・
        </Typography>
      </ThemeProvider>
      <div className="canvas" width="438" height="582">
        <canvas id="myCanvas" width="434" height="434">
          {" "}
        </canvas>
      </div>
      <Button
        variant="contained"
        onClick={startSpin}
        style={{
          backgroundColor: "#9fe4e2",
        }}
      >
        START
      </Button>
    </Box>
  );
}
