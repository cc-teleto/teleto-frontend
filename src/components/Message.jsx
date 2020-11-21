import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";
import { useEffect } from "react";

export default function Message(props) {
  const [timeLeft, setTimeLeft] = useState();
  let alertMsg = "";
  let periodMsg = "";
  if (timeLeft > 0) {
    periodMsg = `残り時間: ${timeLeft}分`;
  }

  useEffect(() => {
    setTimeLeft(props.period);
  }, [props.period])

  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000 * 60);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (props.severity && props.message) {
    alertMsg = <Alert severity={props.severity}>{props.message}</Alert>;
  }
  return (
    <Box display="flex" flexWrap="nowrap" width="50%">
      <Box width="100%">{alertMsg}</Box>
      <Box flexShrink={0}>{periodMsg}</Box>
    </Box>
  );
}

Message.defaultProps = {
  severity: "",
  message: "",
};
