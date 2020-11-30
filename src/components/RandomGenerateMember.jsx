import { Box, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DiceIcon from "@material-ui/icons/Casino";
import { useHistory, useLocation } from "react-router-dom";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";

import React, { useContext } from "react";
// import PropTypes from "prop-types";
// import TextLoop from "react-text-loop";
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";

export default function RandomGenerateMember() {
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const history = useHistory();
  const location = useLocation();
  const {
    // members,
    // category,
    // ws,
    // selectedTopic,
    // setSelectedTopic,
    setCurrentView,
    selectedTalker,
    // grouphash
  } = useContext(AppContext);
  const path = location.pathname.split("/");
  const grouphash = path[2];
  // const { fetchURL } = props;
  // const [membersLoop, setMembersLoop] = useState(
  //   Object.values(members.members)
  // );
  // const [interval, setInterval] = useState(100);

  // const stopText = (text) => {
  //   setTimeout(() => {
  //     setMembersLoop(text);
  //   }, 1300);
  //   setTimeout(() => {
  //     setInterval(0);
  //   }, 1500);
  // };

  // const startText = () => {
  //   setMembersLoop(Object.values(members.members));
  //   setInterval(100);
  // };

  // const fetchContent = async () => {
  //   try {
  //     const res = await fetch(fetchURL, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     // const data = await res.json();
  //     // if (data) {
  //     //   stopText(Object.values(data));
  //     // }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   if (fetchURL) {
  //     startText();
  //     fetchContent();
  //   }
  // }, [fetchURL]);

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
          <Typography variant="h4" align="center">
            {selectedTalker} さん
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
          startIcon={<DiceIcon />}
           onClick={async () => {
            setCurrentView(CURRENT_VIEW.ROULETTE);
            history.push(`/roulette/${grouphash}`);
           }}
          style={{
            backgroundColor: "#9fe4e2",
            fontSize: "15px",
          }}
        >
          話す人をチェンジ
        </Button>
      </Box>
    </Box>
  );
}

// RandomGenerateMember.propTypes = {
//   fetchURL: PropTypes.string.isRequired,
// };
