import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import TextLoop from "react-text-loop";
import { Grid, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
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
    <Grid
      container
      item
      direction="column"
      justify="center"
      alignItems="center"
      spacing={3}
      xs={12}
    >
      <Grid item xs={12}>
        <Typography variant="h3" align="center">
          <TextLoop interval={interval}>{membersLoop}</TextLoop>さん！
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          style={{ fontSize: "20px" }}
          onClick={async () => {
            startText();
            fetchContent();
          }}
        >
          話す人をチェンジ
        </Button>
      </Grid>
    </Grid>
  );
}

RandomGenerateMember.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
