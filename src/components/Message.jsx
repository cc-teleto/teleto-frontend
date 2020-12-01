import React, { useContext, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";

import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";

export default function Message(props) {
  // const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(-1);
  const [alertMsg, setAlertMsg] = useState("");
  const { currentView, endPeriod } = useContext(AppContext);
  const { period, severity, message } = props;

  useEffect(() => {
    // setTimeLeft(period);
    const dt = moment();
    const endTime = moment(endPeriod);
    const dif = endTime.diff(dt, "minutes");
    setTimeLeft(dif + 1);
  }, [period, endPeriod]);

  useEffect(() => {
    let intervalId;
    if (endPeriod) {
      intervalId = setInterval(() => {
        // setTimeLeft(timeLeft - 1);
        const dt = moment();
        const endTime = moment(endPeriod);
        const dif = endTime.diff(dt, "minutes");
        setTimeLeft(dif + 1);
      }, 1000 * 60);
    }
    if (timeLeft === 0 && currentView === CURRENT_VIEW.RANDOM_GENERATE) {
      setAlertMsg("終了");
      alert("終了時刻となりました");
    }
    return () => clearInterval(intervalId);
  }, [timeLeft, currentView, endPeriod]);

  if (severity && message) {
    setAlertMsg(<Alert severity={severity}>{message}</Alert>);
  }

  function copyOverrideOnce(s) {
    document.addEventListener(
      "copy",
      function (e) {
        e.clipboardData.setData("text/plain", s);
        e.preventDefault();
      },
      { once: true }
    );
  }

  const urlCopy = () => {
    // コピーイベントでの処理を登録する(1回のみ).
    copyOverrideOnce(window.location.href);
    // copyOverrideOnce(location.pathname);
    // コピーイベントを発生させる.
    document.execCommand("copy");

    // コピーをお知らせする
    alert("URLをコピーしました！参加者にURLを通知してください！！");
  };

  return (
    <Box display="flex" flexWrap="nowrap" width="90%">
      <Box width="50%">{alertMsg}</Box>
      <Box display="flex" flexWrap="nowrap" width="100%">
        <font face="arial">
          <Box flexShrink={0}>
            {timeLeft > 0 ? `残り時間: ${timeLeft}分` : ""}
          </Box>
        </font>
      </Box>
      <Box display="flex" flexWrap="nowrap" width="100%" align-items="center">
        <Button
          variant="contained"
          onClick={() => urlCopy()}
          style={{
            backgroundColor: "#9fe4e2",
            width: "100px",
            height: "20px",
            margin: "2px 20px",
          }}
        >
          URLCOPY
        </Button>
      </Box>
    </Box>
  );
}

Message.propTypes = {
  severity: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  period: PropTypes.number.isRequired,
};
