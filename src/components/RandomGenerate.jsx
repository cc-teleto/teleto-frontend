import { Box, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import fetch from "node-fetch";

export default function RandomGenerate(props) {
  const [content, setContent] = useState("");
  // const isFirstRender = useRef(false);
  const { title, buttonTitle, fetchURL } = props;

  // 表示内容をfetchURLから取得し、stateを更新する
  const fetchContent = async () => {
    const res = await fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data) {
      setContent(Object.values(data));
    }
  };

  // useEffect(() => {
  //   isFirstRender.current = true;
  // }, []);

  useEffect(() => {
    if (fetchURL) {
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
      <p>{title}</p>
      <p>{content}</p>
      <Button variant="contained" onClick={async () => fetchContent()}>
        {buttonTitle}
      </Button>
    </Box>
  );
}

RandomGenerate.propTypes = {
  title: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  fetchURL: PropTypes.string.isRequired,
};
