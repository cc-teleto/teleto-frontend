import { Box, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DiceIcon from "@material-ui/icons/Casino";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";

import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import TextLoop from "react-text-loop";
import AppContext from "../context/AppContext";

export default function RandomGenerateMember(props) {
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
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
      m={3}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        m={3}
      >
        <ThemeProvider theme={theme}>
          <Typography variant="h4" align="center">
            <TextLoop interval={interval}>{membersLoop}</TextLoop> さん
          </Typography>
        </ThemeProvider>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="contained"
          startIcon={<DiceIcon />}
          onClick={async () => {
            startText();
            fetchContent();
          }}
          style={{
            backgroundColor: "#9fe4e2",
            fontSize: "15px",
          }}
        >
          話す人をチェンジ
        </Button>
      </Box>
    </Box>
  );
}

RandomGenerateMember.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
