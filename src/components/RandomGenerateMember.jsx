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
import AppContext from "../context/AppContext";
import { CURRENT_VIEW } from "../const";

export default function RandomGenerateMember() {
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const history = useHistory();
  const location = useLocation();
  const {
    setCurrentView,
    selectedTalker,
    setRouletteMode,
    // grouphash
  } = useContext(AppContext);
  const path = location.pathname.split("/");
  const grouphash = path[2];
  
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
            setRouletteMode("HUMAN");
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
