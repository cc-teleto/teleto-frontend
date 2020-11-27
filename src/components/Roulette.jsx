import React, { useEffect, useContext } from "react";
import { Box } from "@material-ui/core";
import Winwheel from "../utils/Winwheel";
import AppContext from "../context/AppContext";

export default function Roulette() {
  const { members } = useContext(AppContext);
  let theWheel;
  const colorList = ["#eae56f", "#89f26e", "#7de6ef", "#e7706f"];

  // Called when the animation has finished.
  function alertPrize(indicatedSegment) {
    // Do basic alert of the segment text.
    alert(String(indicatedSegment.text));
  }

  useEffect(() => {
    console.log(members);
    const segmentList = Object.values(members.members).map(function (
      value,
      index
    ) {
      return { fillStyle: colorList[index % 4], text: value };
    });

    theWheel = new Winwheel({
      canvasId: "myCanvas",
      numSegments: members.maxId, // Number of segments
      outerRadius: 100, // The size of the wheel.
      // 'centerX'      : 217,       // Used to position on the background correctly.
      // 'centerY'      : 219,
      textFontSize: 10, // Font size.
      // Definition of all the segments.

      segments: segmentList,
      //   [
      //     { fillStyle: "#eae56f", text: "Prize 1" },
      //     { fillStyle: "#89f26e", text: "Prize 2" },
      //     { fillStyle: "#7de6ef", text: "Prize 3" },
      //     { fillStyle: "#e7706f", text: "Prize 4" },
      //     { fillStyle: "#eae56f", text: "Prize 5" },
      //     { fillStyle: "#89f26e", text: "Prize 6" },
      //     { fillStyle: "#7de6ef", text: "Prize 7" },
      //     { fillStyle: "#e7706f", text: "Prize 8" },
      //   ],
      // Definition of the animation
      animation: {
        type: "spinToStop",
        duration: 5,
        spins: 8,
        callbackFinished: alertPrize,
      },
    });
    console.log(theWheel);
  }, []);

  // Vars used by the code in this page to do power controls.
  const wheelPower = 0;
  let wheelSpinning = false;

  // -------------------------------------------------------
  // Click handler for spin button.
  // -------------------------------------------------------
  function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning === false) {
      // Based on the power level selected adjust the number of spins for the wheel, the more times is has
      // to rotate with the duration of the animation the quicker the wheel spins.
      if (wheelPower === 1) {
        theWheel.animation.spins = 3;
      } else if (wheelPower === 2) {
        theWheel.animation.spins = 8;
      } else if (wheelPower === 3) {
        theWheel.animation.spins = 15;
      }

      // Disable the spin button so can't click again while wheel is spinning.
      document.getElementById("spin_button").src = "spin_off.png";
      document.getElementById("spin_button").className = "";

      // Begin the spin animation by calling startAnimation on the wheel object.
      theWheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      wheelSpinning = true;
    }
  }

  return (
    <Box justifyContent="center" display="flex">
      <canvas id="myCanvas" width="250" height="250">
        {" "}
      </canvas>
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
