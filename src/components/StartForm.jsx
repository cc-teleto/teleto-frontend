import _ from "lodash";
import React, { useContext, useReducer, useState } from "react";
import { Box, Button } from "@material-ui/core";
import fetch from "node-fetch";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import StartFormSelect from "./StartFormSelect";
import StartFormInput from "./StartFormInput";

const DEFAULT_PERIOD = 2;
const MEMBER_POST_URL = getURL("/members");

const MAX_PERIOD = 3;
const PERIOD_INTERVAL = 0.5;

// 開催時間の選択リストを作成する
const periodSelectMap = _.range(
  PERIOD_INTERVAL,
  MAX_PERIOD + PERIOD_INTERVAL,
  PERIOD_INTERVAL
).map((hour) => {
  return { name: `${hour}時間`, value: hour };
});

// 参加者入力を保持するためのReducer
const membersInputReducer = (state, action) => {
  const newState = { ...state };
  if (!action) {
    return state;
  }
  switch (action.type) {
    case "add":
      newState.maxId += 1;
      newState.members[`member${newState.maxId}`] = "";
      break;
    case "update":
      newState.members[action.key] = action.value;
      break;
    case "delete":
      delete newState.members[action.key];
      break;
    case null:
      break;
    default:
      throw new Error(action.type, "is not found");
  }
  return newState;
};

export default function StartForm() {
  const {
    setPeriod,
    setCurrentView,
    members,
    setMembers,
    setGroupHash,
  } = useContext(AppContext);
  const [periodInput, setPeriodInput] = useState(DEFAULT_PERIOD);
  const [membersInput, setMembersInput] = useReducer(
    membersInputReducer,
    members
  );

  const addMember = () => {
    setMembersInput({
      type: "add",
    });
  };

  // 参加者のリストをAPIに送信する
  const postMembers = async (_members) => {
    const body = {
      members: _members.map((member) => {
        return { name: member };
      }),
    };
    const res = await fetch(MEMBER_POST_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setGroupHash(data.grouphash);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    postMembers(Object.values(membersInput.members));
    setMembers(membersInput);
    setPeriod(periodInput);
    setCurrentView(CURRENT_VIEW.RANDOM_GENERATE);
  };

  return (
    <form id="start-form" onSubmit={onSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <StartFormSelect
          title="開催時間"
          periodInput={periodInput}
          onChange={(e) => setPeriodInput(e.target.value)}
          selectMap={periodSelectMap}
        />
        <StartFormInput
          title="参加者名"
          membersInput={membersInput}
          setMembersInput={setMembersInput}
        />
        <Box display="flex" width="100%" justifyContent="space-between">
          <Button variant="contained" onClick={addMember}>
            参加者追加
          </Button>
          <Button variant="contained" type="submit">
            開始
          </Button>
        </Box>
      </Box>
    </form>
  );
}
