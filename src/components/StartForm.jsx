import { useContext } from "react";
import { useState } from "react";
import { CURRENT_VIEW, getURL } from "../const";
import AppContext from "../context/AppContext";
import "../styles/startForm.css";

const DEFAULT_HOUR = 2;
const MEMBER_POST_URL = getURL("/members");

export default function StartForm() {
  const [period, setPeriod] = useState(DEFAULT_HOUR);
  const [memberName, setMemberName] = useState("");
  const { currentViewDispatch } = useContext(AppContext);

  const onSubmit = (e) => {
    e.preventDefault();
    (async () => {
      const members = memberName.trim().split(",");
      await fetch(MEMBER_POST_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(members),
      }).catch((err) => {
        console.log(err);
      });
    })();
    currentViewDispatch(CURRENT_VIEW.RANDOM_GENERATE);
  };

  const onChangePeriod = (e) => {
    setPeriod(e.target.value);
  };

  const onChangeMemberName = (e) => {
    setMemberName(e.target.value);
  };

  let periodList = [];
  for (const hour of [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]) {
    periodList.push(
      <option value={hour} key={hour}>
        {hour}時間
      </option>
    );
  }
  return (
    <main>
      <form id="start-form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="period">飲み会時間</label>
          <select
            id="period"
            name="period"
            form="start-form"
            value={period}
            onChange={onChangePeriod}
          >
            {periodList}
          </select>
          <div>
            <label htmlFor="member">参加者一覧</label>
            <input
              id="member"
              type="text"
              name="member"
              value={memberName}
              onChange={onChangeMemberName}
            />
          </div>
        </div>
        <button type="submit">開始</button>
      </form>
    </main>
  );
}
