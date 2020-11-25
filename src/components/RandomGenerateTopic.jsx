import { Box, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import TextLoop from "react-text-loop";

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
          <p>
            {array[0]}
            <a href={twitterLink} target="_blank" rel="noreferrer">
              {array[1]}
            </a>
            {array[2]}
          </p>
        );
      } else {
        content = <p>{data.value}</p>;
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
    >
      <p>話題</p>
      <TextLoop interval={interval}>{topicsLoop}</TextLoop>
      <Button
        variant="contained"
        onClick={async () => {
          startText();
          fetchContent();
        }}
      >
        話題切替
      </Button>
    </Box>
  );
}

RandomGenerateTopic.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
