import { useState } from "react";

export default function RandomGenerate(props) {
  const [content, setContent] = useState("");

  const onClick = async () => {
    setContent()
  };

  return (
    <div>
      <p>{props.title}</p>
      <p>{content}</p>
      <button onClick={onClick}>{props.buttonTitle}</button>
    </div>
  );
}
