import { getURL } from "../const";

export default async function getRoomInfo(grouphash) {
    const ROOM_GET_URL = getURL("/room");
    const strURL = `${ROOM_GET_URL}?grouphash=${grouphash}`;
    // const strURL = ROOM_GET_URL + "?grouphash=" + grouphash;
    const res = await fetch(strURL, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        mode: "cors",
    });
    return res.json();
}


