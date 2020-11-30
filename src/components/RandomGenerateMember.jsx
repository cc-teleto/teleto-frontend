import { Box, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DiceIcon from "@material-ui/icons/Casino";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import React, { useContext } from "react";
import AppContext from "../context/AppContext";

export default function RandomGenerateMember() {
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  const { selectedTalker } = useContext(AppContext);

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
