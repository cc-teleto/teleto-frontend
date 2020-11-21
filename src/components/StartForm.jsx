import { MenuItem, TextField } from "@material-ui/core";
import { useContext } from "react";
import { useState } from "react";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import StartFormSelect from "./StartFormSelect";
import StartFormInput from "./StartFormInput";
import _ from "lodash";

const MEMBER_POST_URL = getURL("/members");

const periodSelectList = [];
for (let hour of _.range(0, 5, 0.5)) {
  hour = hour + 0.5;
  periodSelectList.push(
    <MenuItem value={hour} key={hour}>
      {hour}時間
    </MenuItem>
  );
}

export default function StartForm() {
  const [period, setPeriod] = useState("");
  const [member, setMember] = useState("");
  const periodField = {
    id: "period",
    name: "開催時間",
    state: period,
  };

  // const { currentViewDispatch } = useContext(AppContext);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(period);
    // (async () => {
    //   const members = memberName.trim().split(",");
    //   await fetch(MEMBER_POST_URL, {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(members),
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // })();
    // currentViewDispatch(CURRENT_VIEW.RANDOM_GENERATE);
  };

  const onChangeMember = (e) => {
    console.log(e.target.value);
    setMember(e.target.value);
  };

  return (
    <main>
      <form id="start-form" onSubmit={onSubmit}>
        <StartFormSelect
          field={periodField}
          dispatch={setPeriod}
          selectList={periodSelectList}
        />
        <StartFormInput />
        <button type="submit">開始</button>
      </form>
    </main>
  );
}
