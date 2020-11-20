import { useState } from "react";
import { getURL } from "../const";
import "../styles/startForm.css";

const DEFAULT_HOUR = 2;
const MEMBER_POST_URL = getURL("/members");

export default function StartForm() {
  const [period, setPeriod] = useState(DEFAULT_HOUR);
  const [memberName, setMemberName] = useState("");

  const onSubmit = (e) => {
    (async () => {
      e.preventDefault();
      const members = memberName.trim().split(",");
      const method = "POST";
      const body = JSON.stringify(members);
      const mode = "no-cors";
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const res = await fetch(MEMBER_POST_URL, {
        method,
        headers,
        body,
        mode,
      }).catch((err) => {
        console.log(err);
      });
      const data = await res.json().catch((err) => {
        console.log(err);
      });
      console.log(data);
    })();
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
