import React, { useEffect, useState, useContext } from "react";
import { Box } from "@material-ui/core";
import Winwheel from "../utils/Winwheel";
import AppContext from "../context/AppContext";
import "../styles/styles.css";

export default function Roulette() {
  const { members } = useContext(AppContext);
  const [wheel, setWheel] = useState();
  const audio = new Audio("/tick.mp3");
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];

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
        outerRadius: 110, // The size of the wheel.
        innerRadius: 30,
        centerX: 217, // Used to position on the background correctly.
        centerY: 222,
        textOrientation: "vertical",
        textFontSize: 13, // Font size.\
        rotationAngle: -360 / itemNumber / 2, // show the default position aligned to the text
        // Definition of all the segments.
        segments: segmentList,
        // Specify pin parameters.
        pins: {
          number: itemNumber,
          outerRadius: 4,
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

  // Vars used by the code in this page to do power controls.
  let wheelSpinning = false;

  // -------------------------------------------------------
  // Click handler for spin button.
  // -------------------------------------------------------
  function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning === false) {
      // Disable the spin button so can't click again while wheel is spinning.
      document.getElementById("spin_button").src = "spin_off.png";
      document.getElementById("spin_button").className = "";

      // Begin the spin animation by calling startAnimation on the wheel object.
      wheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      wheelSpinning = true;
    }
  }

  return (
    <Box justifyContent="center" display="flex">
      <div className="canvas" width="438" height="582">
        <canvas id="myCanvas" width="434" height="434">
          {" "}
        </canvas>
      </div>
      <input
        type="button"
        value="SPIN"
        id="spin_button"
        src="spin_off.png"
        alt="Spin"
        onClick={startSpin}
        onKeyDown={startSpin}
      />
    </Box>
  );
}
