import { TextField, IconButton, Box, Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { getURL } from "../const";
import AppContext from "../context/AppContext";

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
  const [list, setList] = useState([]);
  const [addMem, setAddMem] = useState({ value: "" });
  const { groupHash } = useContext(AppContext);
  const isFirstRender = useRef(false);
  const items = [];
  const { fetchURL } = props;

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

  useEffect(() => {
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
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      border={1}
      style={{ margin: 10, padding: 10 }}
    >
      {items}
      <Box key="addBox" display="flex" width="100%">
        <TextField
          name="add"
          style={{ margin: 0 }}
          placeholder="参加者名"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={addMem.value}
          onChange={handleChange}
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => {
            addMember();
          }}
        >
          追加
        </Button>
      </Box>
    </Box>
  );
}

MembersList.propTypes = {
  fetchURL: PropTypes.string.isRequired,
};
