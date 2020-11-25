import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { CURRENT_VIEW } from "../const";
import AppContext from "../context/AppContext";

export default function Message(props) {
  const [timeLeft, setTimeLeft] = useState(-1);
  const [alertMsg, setAlertMsg] = useState("");
  const { currentView } = useContext(AppContext);
  const { period, severity, message } = props;

  useEffect(() => {
    setTimeLeft(period);
  }, [period]);

  useEffect(() => {
    let intervalId;
    if (timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000 * 60);
    }
    if (timeLeft === 0 && currentView === CURRENT_VIEW.RANDOM_GENERATE) {
      setAlertMsg("終了");
      alert("終了時刻となりました");
    }
    return () => clearInterval(intervalId);
  }, [timeLeft, currentView]);

  if (severity && message) {
    setAlertMsg(<Alert severity={severity}>{message}</Alert>);
  }
  return (
    // <Box display="flex" flexWrap="nowrap" width="50%">
    //   <Box width="100%">{alertMsg}</Box>
    //   <Box flexShrink={0}>{timeLeft > 0 ? `残り時間: ${timeLeft}分` : ""}</Box>
    // </Box>
    <Grid container item direction="column" spacing={1} xs={12}>
      <Grid item xs={12}>
        {alertMsg}
      </Grid>
      <Grid item xs={12}>
        {timeLeft > 0 ? `残り時間: ${timeLeft}分` : ""}
      </Grid>
    </Grid>
  );
}

Message.propTypes = {
  severity: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  period: PropTypes.number.isRequired,
};
