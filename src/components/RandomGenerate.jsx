import { Button } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";


// 表示内容をfetchURLから取得し、stateを更新する
const fetchContent = async (fetchURL, setContent) => {
  try {
    const res = await fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setContent(data);
  } catch (err) {
    console.log(err);
  }
};

export default function RandomGenerate(props) {
  const [content, setContent] = useState("");
  useEffect(() => {
    fetchContent(props.fetchURL, setContent);
  }, [props.fetchURL]);

  const onClick = async () => {
    fetchContent(content, props.fetchURL);
  };

  return (
    <div>
      <p>{props.title}</p>
      <p>{content}</p>
      <Button variant="contained" onClick={onClick}>
        {props.buttonTitle}
      </Button>
    </div>
  );
}
