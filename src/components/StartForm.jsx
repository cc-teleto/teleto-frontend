import { Box, Button, MenuItem } from "@material-ui/core";
import { useContext } from "react";
import { useState } from "react";
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
    <MenuItem value={hour} key={hour}>
      {hour}時間
    </MenuItem>
  );
}

// 参加者のリストをAPIに送信する
const postMemberNames = async (memberNames) => {
  const body = memberNames.trim();
  await fetch(MEMBER_POST_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(body),
  }).catch((err) => {
    console.log(err);
  });
};
export default function StartForm(props) {
  const [memberNames, setMemberNames] = useState(props.memberNames);
  const { period, setPeriod, setCurrentView } = useContext(AppContext);
  const periodField = {
    id: "period",
    name: "開催時間",
    state: period,
  };
  const memberNamesField = {
    id: "memberNames",
    name: "参加者一覧",
    state: memberNames,
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // const res = postMemberNames(memberNames);
    postMemberNames(memberNames);
    setCurrentView(CURRENT_VIEW.RANDOM_GENERATE);
  };

  return (
    <form id="start-form" onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <StartFormSelect field={periodField} dispatch={setPeriod} selectList={periodSelectList} />
        <StartFormInput field={memberNamesField} dispatch={setMemberNames} />
        <Button variant="contained" type="submit">
          開始
        </Button>
      </Box>
    </form>
  );
}

StartForm.defaultProps = {
  memberNames: "",
};
