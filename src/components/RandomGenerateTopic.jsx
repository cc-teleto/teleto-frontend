import { Button, Box, Typography } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import React, { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";

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

export default function RandomGenerateTopic() {
  const location = useLocation();
  const classes = useStyles();
  const history = useHistory();
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const {
    selectedTopic,
    setSelectedTopic,
    setCurrentView,
    setRouletteMode,
  } = useContext(AppContext);

  if (String(selectedTopic).slice(0, 11) === "Twitterトレンド") {
    const array = String(selectedTopic).split(/『|』/);
    const twitterLink = `http://twitter.com/search?q=${encodeURIComponent(
      array[1]
    )}`;
    const content = (
      <>
        {array[0]}
        <a href={twitterLink} target="_blank" rel="noreferrer">
          {array[1]}
        </a>
        {array[2]}
      </>
    );
    setSelectedTopic(content);
  }  function handleOnClick() {
    const path = location.pathname.split("/");
    const grouphash = path[2];
    setCurrentView(CURRENT_VIEW.ROULETTE);
    setRouletteMode("TOPIC");
    history.push(`/roulette/${grouphash}`);
  }
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
            {selectedTopic}
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
          onClick={() => handleOnClick()}
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