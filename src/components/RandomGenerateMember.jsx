import { Box, Button } from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import TextLoop from "react-text-loop";
import AppContext from "../context/AppContext";

export default function RandomGenerateMember(props) {
  const { fetchURL } = props;
  const { members } = useContext(AppContext);
  const [membersLoop, setMembersLoop] = useState(
    Object.values(members.members)
  );
  const [interval, setInterval] = useState(100);

  const stopText = (text) => {
    setTimeout(() => {
      setMembersLoop(text);
    }, 1300);
    setTimeout(() => {
      setInterval(0);
    }, 1500);
  };

  const startText = () => {
    setMembersLoop(Object.values(members.members));
    setInterval(100);
  };

  const fetchContent = async () => {
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

  useEffect(() => {
    if (fetchURL) {
      startText();
      fetchContent();
    }
  }, [fetchURL]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <p>話者</p>
      <TextLoop interval={interval}>{membersLoop}</TextLoop>
      <Button
        variant="contained"
        onClick={async () => {
          startText();
          fetchContent();
        }}
      >
        話者切替
      </Button>
    </Box>
  );
}

RandomGenerateMember.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
