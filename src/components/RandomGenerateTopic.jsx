import { Box, Button } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { useState } from "react";
import TextLoop from "react-text-loop";

export default function RandomGenerateTopic(props) {
  const isFirstRender = useRef(false);
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
      setTopicsLoop(text);
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
    setTopicsLoop(dummyTopics);
    setInterval(100);
    fetchContent(props.fetchURL);
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <p>話題</p>
      <TextLoop interval={interval} children={topicsLoop} />
      <Button variant="contained" onClick={onClick}>
        話題切替
      </Button>
    </Box>
  );
}
