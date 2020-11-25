import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";

import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import RandomGenerateTopic from "./RandomGenerateTopic";
import RandomGenerateMember from "./RandomGenerateMember";
import MembersList from "./MembersList";
import StartForm from "./StartForm";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

export default function Main() {
  const { groupHash, currentView } = useContext(AppContext);
  const [topicFetchURL, setTopicFetchURL] = useState("");
  const [memberFetchURL, setMemberFetchURL] = useState("");
  const [allMemberFetchURL, setAllMemberFetchURL] = useState();

  useEffect(() => {
    if (groupHash) {
      setTopicFetchURL(
        getURL("/topics", `/?random=true&grouphash=${groupHash}`)
      );
      setMemberFetchURL(
        getURL("/members", `/?random=true&grouphash=${groupHash}`)
      );
      setAllMemberFetchURL(
        getURL("/members", `/?random=false&grouphash=${groupHash}`)
      );
    }
  }, [groupHash]);

  if (currentView === CURRENT_VIEW.START_FORM) {
    return <StartForm />;
  }
  if (currentView === CURRENT_VIEW.RANDOM_GENERATE) {
    return (
      <ThemeProvider theme={theme}>
        <Grid
          container
          item
          xs={12}
          direction="column"
          justify="center"
          alignItems="stretch"
          spacing={5}
        >
          <RandomGenerateMember fetchURL={memberFetchURL} />
          <RandomGenerateTopic fetchURL={topicFetchURL} />
        </Grid>
        <MembersList fetchURL={allMemberFetchURL} />
      </ThemeProvider>
    );
  }
  return null;
}
