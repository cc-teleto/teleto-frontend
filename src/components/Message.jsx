import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
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
    if (timeLeft > 0) {
      setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000 * 60);
    }
    if (timeLeft === 0 && currentView === CURRENT_VIEW.RANDOM_GENERATE) {
      setAlertMsg("終了時刻となりました");
    }
    return () => clearInterval();
  }, [timeLeft, currentView]);

  if (severity && message) {
    setAlertMsg(<Alert severity={severity}>{message}</Alert>);
  }
  return (
    <Box display="flex" flexWrap="nowrap" width="50%">
      <Box width="100%">{alertMsg}</Box>
      <Box flexShrink={0}>{timeLeft > 0 ? `残り時間: ${timeLeft}分` : ""}</Box>
    </Box>
  );
}

Message.propTypes = {
  severity: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  period: PropTypes.number.isRequired,
};
