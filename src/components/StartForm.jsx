import _ from "lodash";
import React, { useContext, useReducer, useState } from "react";
import { Box, Button } from "@material-ui/core";
import fetch from "node-fetch";
import { DEFAULT_CATEGORY, CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import StartFormSelect from "./StartFormSelect";
import StartFormInput from "./StartFormInput";
import StartFormInputRooms from "./StartFormInputRooms";

const DEFAULT_PERIOD = 2;
const MEMBER_POST_URL = getURL("/members");
const MEMBER_AND_ROOM_POST_URL = getURL("/membersAndRooms");

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

// ルーム入力を保持するためのReducer
const roomsInputReducer = (state, action) => {
  const newState = { ...state };
  if (!action) {
    return state;
  }
  switch (action.type) {
    case "add":
      newState.maxId += 1;
      newState.rooms[`room${newState.maxId}`] = "";
      break;
    case "update":
      newState.rooms[action.key] = action.value;
      break;
    case "delete":
      delete newState.rooms[action.key];
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
    rooms,
    setRooms,
    setGroupHash,
    category,
    setCategory,
  } = useContext(AppContext);
  const [periodInput, setPeriodInput] = useState(DEFAULT_PERIOD);
  const [categoryInput, setCategoryInput] = useState(category);
  const [membersInput, setMembersInput] = useReducer(
    membersInputReducer,
    members
  );
  const [roomsInput, setRoomsInput] = useReducer(
    roomsInputReducer,
    rooms
  );

  const addMember = () => {
    setMembersInput({
      type: "add",
    });
  };

  const addRoom = () => {
    setRoomsInput({
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

  // 参加者とルームのリストをAPIに送信する
  const postMembersAndRooms = async (_members, _rooms) => {
    const body = {
      members: _members.map((member) => {
        return { name: member };
      }),
      rooms: _rooms.map((room, idx) => {
        return { 
          id: idx,
          info: room };
      }),
    };
    const res = await fetch(MEMBER_AND_ROOM_POST_URL, {
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
    if (Object.keys(rooms.rooms).length === 0){
      e.preventDefault();
      setCategory(categoryInput);
      postMembers(Object.values(membersInput.members));
      setMembers(membersInput);
      setPeriod(periodInput);
      setCurrentView(CURRENT_VIEW.RANDOM_GENERATE);
    }else{
      e.preventDefault();
      setCategory(categoryInput);
      postMembersAndRooms(Object.values(membersInput.members), Object.values(roomsInput.rooms))
      setMembers(membersInput);
      setRooms(roomsInput);
      // TODO 会議全体の時間と、ルームごとの時間を設定できるようにする
      // setPeriod(periodInput);
      setCurrentView(CURRENT_VIEW.ROOM_GENERATE);
    }
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
          {Object.keys(rooms.rooms).length === 0 ? (
            <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: "#9fe4e2",
            }}
          >
            開始
          </Button>
          ) : ""
        }
          
        </Box>
        <StartFormInputRooms
          title="ルーム情報"
          roomsInput={roomsInput}
          setRoomsInput={setRoomsInput}
        />
        <Box display="flex" width="100%" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={addRoom}
            style={{
              backgroundColor: "#9fe4e2",
            }}
          >
            ルーム追加
          </Button>
          <Button
            variant="contained"
            type="submit"
            style={{
              backgroundColor: "#9fe4e2",
            }}
          >
            ルーム分け
          </Button>
        </Box>
      </Box>
    </form>
  );
}
