import { Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";

export default function Message(props) {
  const [remainTime, setRemainTime] = useState("");

  let alert = <div></div>;
  if (props.severity && props.message) {
    alert = <Alert severity={props.severity}>{props.message}</Alert>;
  }
  return (
    <Box display="flex" flexWrap="nowrap">
      <Box flexGrow={1}>{alert}</Box>
      <Box>{remainTime}</Box>
    </Box>
  );
}

Message.defaultProps = {
  severity: "",
  message: "",
};
