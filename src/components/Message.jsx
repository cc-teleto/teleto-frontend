import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";
import { useEffect } from "react";

export default function Message(props) {
  const [timeLeft, setTimeLeft] = useState(props.period);
  let alertMsg = "";
  let periodMsg = "";
  if (props.period > 0) {
    periodMsg = `残り時間: ${timeLeft}分`;
  }

  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000*60);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (props.severity && props.message) {
    alertMsg = <Alert severity={props.severity}>{props.message}</Alert>;
  }
  return (
    <Box display="flex" flexWrap="nowrap">
      <Box flexGrow={1}>{alertMsg}</Box>
      <Box>{periodMsg}</Box>
    </Box>
  );
}

Message.defaultProps = {
  severity: "",
  message: "",
};
