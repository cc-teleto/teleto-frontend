import {
    TextField,
    IconButton,
    Box,
    Button
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { getURL } from "../const";
import AppContext from "../context/AppContext";
import { useContext } from "react";

const fetchContent = async (fetchURL) => {
    try {
        const res = await fetch(fetchURL, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data;

    } catch (err) {
        console.log(err);
    }

};

const fetchDeleteMember = async (fetchURL) => {
    try {
        const res = await fetch(fetchURL, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Request-Method": "DELETE"
            },
        });
        const data = await res.json();
        return data;

    } catch (err) {
        console.log(err);
    }

};
const fetchAddMember = async (fetchURL, addMem) => {
    const body = {
        members: []
    }
    body.members.push({
        name: addMem.value
    })

    try {
        const res = await fetch(fetchURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Request-Method": "DELETE"
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        return data;

    } catch (err) {
        console.log(err);
    }

};

export default function MembersList(props) {
    const [list, setList] = useState([]);
    const [addMem, setAddMem] = useState({ value: "" });
    const { groupHash } = useContext(AppContext);
    const isFirstRender = useRef(false);
    let items = [];

    useEffect(() => {
        isFirstRender.current = true;
    }, []);

    useEffect(() => {
        (async () => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
            } else {
                let data = await fetchContent(props.fetchURL);

                setList(data.members);
            }
        })();
    }, [props.fetchURL]);

    async function deleteMember(key) {

        let url = "/?memberhash=" + list[key].memberhash + "&grouphash=" + list[key].grouphash;
        await fetchDeleteMember(getURL("/members", url));
        let data = await fetchContent(props.fetchURL);

        setList(data.members);

    };

    async function addMember() {

        let url = "/?grouphash=" + groupHash;
        await fetchAddMember(getURL("/members", url), addMem);
        setAddMem({ value: "" });
        let data = await fetchContent(props.fetchURL);

        setList(data.members);

    };

    function handleChange(e) {
        setAddMem({ value: e.target.value });
    }

    for (let key in list) {
        items.push(
            <div key={key}>
                {list[key].membername}
                <IconButton name={list[key].membername} aria-label="delete" color="secondary" onClick={e => {
                    deleteMember(key)
                }}>
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }

    return (
        <Box className="box1" display="flex" flexDirection="column" justifyContent="center" alignItems="center" border={1} style={{margin: 10, padding: 10}}>
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
            <Button variant="contained" onClick={e => {
                addMember()
            }}>
                追加
            </Button>
            </Box>
        </Box>
    );
}
