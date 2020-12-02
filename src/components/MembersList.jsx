import {
  TextField,
  IconButton,
  Box,
  Button,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { getURL } from "../const";
import AppContext from "../context/AppContext";
import LogoWithText from "./LogoWithText";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginRight: theme.spacing(1),
    },
  },
}));

const fetchDeleteMember = async (fetchURL) => {
  let data = "";
  try {
    const res = await fetch(fetchURL, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Request-Method": "DELETE",
      },
    });
    data = await res.json();
  } catch (err) {
    console.log(err);
  }
  return data;
};
const fetchAddMember = async (fetchURL, addMem) => {
  const body = {
    members: [],
  };
  body.members.push({
    name: addMem.value,
  });
  let data = "";
  try {
    const res = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    data = await res.json();
  } catch (err) {
    console.log(err);
  }
  return data;
};

export default function MembersList(props) {
  const classes = useStyles();
  const [list, setList] = useState([]);
  const [addMem, setAddMem] = useState({ value: "" });
  const { mobileOpen, setMobileOpen, members } = useContext(AppContext);
  const isFirstRender = useRef(false);
  const items = [];
  const { fetchURL } = props;

  const location = useLocation();
  const path = location.pathname.split("/");
  const groupHash = path[2];

  const fetchContent = async () => {
    let data = "";
    try {
      const res = await fetch(fetchURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      data = await res.json();
    } catch (err) {
      console.log(err);
    }
    return data;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const addMemberList = Object.values(members.members).map(function (value) {
      return { membername: value };
    });
    setList(addMemberList);
    isFirstRender.current = true;
  }, []);

  useEffect(() => {
    (async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        const data = await fetchContent();
        setList(data.members);
      }
    })();
  }, [fetchURL]);

  async function deleteMember(key) {
    const url = `/?memberhash=${list[key].memberhash}&grouphash=${list[key].grouphash}`;
    await fetchDeleteMember(getURL("/members", url));
    const data = await fetchContent();

    setList(data.members);
  }

  async function addMember() {
    const url = `/?grouphash=${groupHash}`;
    await fetchAddMember(getURL("/members", url), addMem);
    setAddMem({ value: "" });
    const data = await fetchContent();

    setList(data.members);
  }

  function handleChange(e) {
    setAddMem({ value: e.target.value });
  }

  Object.entries(list).map(([key, value]) => {
    return items.push(
      <div key={key}>
        {value.membername}
        <IconButton
          name={value.membername}
          aria-label="delete"
          color="secondary"
          onClick={() => {
            deleteMember(key);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  });

  return (
    <Box
      className="box1"
      // display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ margin: 10, padding: 10 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <LogoWithText />
      </Box>

      <Box display="flex" flexDirection="column" width="100%">
        <Typography variant="h5" align="left">
          参加者リスト
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <font face="arial">{items}</font>
      </Box>
      <Box key="addBox" display="flex" width="100%" className={classes.root}>
        <TextField
          name="add"
          mr={3}
          placeholder="参加者名"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={addMem.value}
          onChange={handleChange}
          size="small"
          margin="none"
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            addMember();
          }}
          style={{
            backgroundColor: "#9fe4e2",
          }}
        >
          追加
        </Button>
      </Box>
      <Box display="flex" flexDirection="column" m={3}>
        <Button
          onClick={handleDrawerToggle}
          style={{
            backgroundColor: "#9fe4e2",
          }}
          variant="contained"
        >
          もどる
        </Button>
      </Box>
    </Box>
  );
}

MembersList.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
