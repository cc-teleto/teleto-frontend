import { Button, Box, Typography } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextLoop from "react-text-loop";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.only("xs")]: {
      "& .textLoopDone": {
        "& > div": {
          width: "auto !important",
          height: "auto !important",
          "& > div": {
            position: "static !important",
            whiteSpace: "normal !important",
          },
        },
      },
      "& > div": {
        "& > div": {
          "& > div": {
            whiteSpace: "normal !important",
          },
        },
      },
    },
  },
}));

export default function RandomGenerateTopic(props) {
  const classes = useStyles();
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);

  const { fetchURL } = props;
  const [interval, setInterval] = useState(100);
  const [isAniDone, setIsAniDone] = useState(false);

  const dummyTopics = [
    "リンゴについてどう思いますか",
    "もし空を飛べるとしたら、何をしますか",
    "トイレットペーパーについて教えてください",
    "どっち派？犬と猫",
    "生姜さんのいい点を一つ教えてください",
    "鈴木さんを動物に例えると何だと思いますか",
    "好きなものをちくわを使ってでプレゼンしてください",
    "メンバーの中でホルンが上手そうな人は誰だと思いますか",
    "うどんとそばのどちらに興味がありますか",
  ];
  const [topicsLoop, setTopicsLoop] = useState(dummyTopics);

  const stopText = (text) => {
    setTimeout(() => {
      setTopicsLoop(text);
    }, 1300);
    setTimeout(() => {
      setInterval(0);
    }, 1500);
    setTimeout(() => {
      setIsAniDone(true);
    }, 2000);
  };

  const startText = () => {
    setIsAniDone(false);
    setTopicsLoop(dummyTopics);
    setInterval(100);
  };

  const fetchContent = async () => {
    try {
      let content = null;
      const res = await fetch(fetchURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.value.slice(0, 11) === "Twitterトレンド") {
        const array = data.value.split(/『|』/);
        const twitterLink = `http://twitter.com/search?q=${encodeURIComponent(
          array[1]
        )}`;
        content = (
          <>
            {array[0]}
            <a href={twitterLink} target="_blank" rel="noreferrer">
              {array[1]}
            </a>
            {array[2]}
          </>
        );
      } else {
        content = data.value;
      }
      if (content) {
        stopText(content);
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
          <Typography variant="h4" align="center" className={classes.root}>
            <TextLoop
              interval={interval}
              className={isAniDone ? "textLoopDone" : ""}
            >
              {topicsLoop}
            </TextLoop>
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
          startIcon={<ChatIcon />}
          onClick={async () => {
            startText();
            fetchContent();
          }}
          style={{
            backgroundColor: "#9fe4e2",
            fontSize: "15px",
          }}
        >
          話題をチェンジ
        </Button>
      </Box>
    </Box>
  );
}

RandomGenerateTopic.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
