import { Box, Button, MenuItem } from "@material-ui/core";
import { useContext } from "react";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import StartFormSelect from "./StartFormSelect";
import StartFormInput from "./StartFormInput";
import _ from "lodash";

const MEMBER_POST_URL = getURL("/members");
const MAX_PERIOD = 3;
const PERIOD_INTERVAL = 0.5;

// 開催時間の選択リストを作成する
const periodSelectList = [];
for (let hour of _.range(0, MAX_PERIOD, PERIOD_INTERVAL)) {
  hour = hour + PERIOD_INTERVAL;
  periodSelectList.push(
    <MenuItem name={"period"} value={hour} key={hour}>
      {hour}時間
    </MenuItem>
  );
}


export default function StartForm() {
  const {
    setPeriod,
    setCurrentView,
    members,
    setMembers,
    periodInput,
    setPeriodInput,
    setGroupHash
  } = useContext(AppContext);

  // 参加者のリストをAPIに送信する
const postMembers = async (members) => {
  try {
    const body = {
      members: []
    }
    for (const member of members) {
      body.members.push({
        name: member
      })
    }
    const res = await fetch(MEMBER_POST_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(body),
    })
    const data = await res.json();
    setGroupHash(data.grouphash)
  } catch(err) {
    console.log(err);
  }
};

  const addMember = () => {
    setMembers({
      type: "add",
    });
  };

  const deleteMember = (e) => {
    setMembers({
      type: "delete",
      key: e.currentTarget.name
    });
  };

  const onChange = (e) => {
    switch (true) {
      case /period/.test(e.target.name):
        setPeriodInput(e.target.value);
        break;
      case /member[0-9]+/.test(e.target.name):
        setMembers({
          type: "update",
          key: e.target.name,
          value: e.target.value,
        });
        break;
      default:
        console.log(e.target.name, "is not found");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    postMembers(Object.values(members.members));
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
          name="period"
          title="開催時間"
          value={periodInput}
          dispatch={onChange}
          selectList={periodSelectList}
        />
        <StartFormInput
          name="members"
          title="参加者名"
          value={members}
          changeDispatch={onChange}
          deleteDispatch={deleteMember}
        />
        <Box display="flex" width="100%" justifyContent="space-between">
          <Button variant="contained" onClick={addMember} >
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
