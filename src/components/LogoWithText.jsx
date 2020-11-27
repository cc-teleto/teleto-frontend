import React from "react";
import { Box } from "@material-ui/core";
import logoWithTextImage from "../img/logo_with_text.png";

export default function LogoWithText() {
  return (
    <Box justifyContent="center" display="flex">
      <input
        type="image"
        className="logo"
        src={logoWithTextImage}
        alt="logoWithTextImage"
      />
    </Box>
  );
}
