import { useState } from "react";

export default function RandomGenerate(props) {
  const [content, setContent] = useState("");

  const onClick = async () => {
    (async () => {
      const res = await fetch(props.fetchURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).catch((err) => {
        console.log(err);
      });
      const data = await res.json().catch((err) => {
        console.log(err);
      });
      setContent(data);
    })();
  };

  return (
    <div>
      <p>{props.title}</p>
      <p>{content}</p>
      <button onClick={onClick}>{props.buttonTitle}</button>
    </div>
  );
}
