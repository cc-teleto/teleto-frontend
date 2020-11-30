import { Button, Box, Typography } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";

import React, { useContext } from "react";
import AppContext from "../context/AppContext";

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
  const classes = useStyles();
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const { selectedTopic, setSelectedTopic } = useContext(AppContext);

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
