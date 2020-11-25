import { Box, Button } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useState, useContext } from "react";
import TextLoop from "react-text-loop";
import AppContext from "../context/AppContext";

export default function RandomGenerateMember(props) {
  const isFirstRender = useRef(false);
  const { members } = useContext(AppContext);
  const [membersLoop, setMembersLoop] = useState(Object.values(members.members));
  const [interval, setInterval] = useState(100);

  const fetchContent = async (fetchURL) => {
    try {
      const res = await fetch(fetchURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data) {
        stopText(Object.values(data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const stopText = (text) => {
    setTimeout(() => {
      setMembersLoop(text);
    }, 1300);
    setTimeout(() => {
      setInterval(0);
    }, 1500);
  };

  useEffect(() => {
    isFirstRender.current = true;
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      fetchContent(props.fetchURL);
    }
  }, [props.fetchURL]);

  const onClick = async () => {
    setMembersLoop(Object.values(members.members));
    setInterval(100);
    fetchContent(props.fetchURL);
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <p>話者</p>
      <TextLoop interval={interval} children={membersLoop} />
      <Button variant="contained" onClick={onClick}>
        話者切替
      </Button>
    </Box>
  );
}
