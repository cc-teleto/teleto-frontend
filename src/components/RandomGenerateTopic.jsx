import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextLoop from "react-text-loop";
import { Grid, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

export default function RandomGenerateTopic(props) {
  const { fetchURL } = props;
  const [interval, setInterval] = useState(100);
  const dummyTopics = [
    "リンゴについてどう思いますか",
    "もし空を飛べるとしたら、何をしますか",
    "トイレットペーパーについて教えてください",
    "どっち派？犬と猫",
    "生姜さんのいい点を一つ教えてください",
    "鈴木さんを動物に例えると何だと思いますか",
    "好きなものをちくわを使ってでプレゼンしてください",
    "メンバーの中で一番ホルンが上手な人は誰だと思いますか",
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
  };

  const startText = () => {
    setTopicsLoop(dummyTopics);
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
          <TextLoop interval={interval}>{topicsLoop}</TextLoop>
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
          話題をチェンジ
        </Button>
      </Grid>
    </Grid>
  );
}

RandomGenerateTopic.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
