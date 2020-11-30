import _ from "lodash";
import React, { useContext, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button } from "@material-ui/core";
import fetch from "node-fetch";
import moment from "moment";
import { DEFAULT_CATEGORY, CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import StartFormSelect from "./StartFormSelect";
import StartFormInput from "./StartFormInput";

const DEFAULT_PERIOD = 2;
const ROOM_POST_URL = getURL("/room");

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

// カテゴリの選択リストを作成する
const categorySelectMap = [DEFAULT_CATEGORY, "初対面", "Twitterトレンド"].map(
  (value) => {
    return {
      name: value,
      value,
    };
  }
);

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
  const history = useHistory();
  const {
    setPeriod,
    setCurrentView,
    members,
    // setMembers,
    setGroupHash,
    category,
    setCategory,
    setEndPeriod,
    //    grouphash,
  } = useContext(AppContext);
  const [periodInput, setPeriodInput] = useState(DEFAULT_PERIOD);
  const [categoryInput, setCategoryInput] = useState(category);
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
  const postRooms = async (_members, _endPeriod, _category) => {
    const body = {
      members: _members.map((member) => {
        return { name: member };
      }),
      endPeriod: _endPeriod,
      category: _category,
    };
    console.log("body:", body);
    const res = await fetch(ROOM_POST_URL, {
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
    console.log("grouphash:", data.grouphash);
    return data.grouphash;
  };

  const calcEndPeriod = (_period) => {
    const dt = moment();
    return dt.add(_period, "hours").format("YYYY-MM-DD HH:mm");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setCategory(categoryInput);
    const endPeriodLocal = calcEndPeriod(periodInput);
    setEndPeriod(calcEndPeriod(periodInput));
    const grouphash = await postRooms(
      Object.values(membersInput.members),
      endPeriodLocal,
      categoryInput
    );
    // setMembers(membersInput);
    setPeriod(periodInput);
    setCurrentView(CURRENT_VIEW.ROULETTE);
    history.push(`/roulette/${grouphash}`);
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
          stateInput={periodInput}
          onChange={(e) => setPeriodInput(e.target.value)}
          selectMap={periodSelectMap}
        />
        <StartFormSelect
          title="カテゴリ"
          stateInput={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          selectMap={categorySelectMap}
        />
        <StartFormInput
          title="参加者名"
          membersInput={membersInput}
          setMembersInput={setMembersInput}
        />
        <Box display="flex" width="100%" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={addMember}
            style={{
              backgroundColor: "#9fe4e2",
            }}
          >
            参加者追加
          </Button>
          <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: "#9fe4e2",
            }}
          >
            開始
          </Button>
        </Box>
      </Box>
    </form>
  );
}
