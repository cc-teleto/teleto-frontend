import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  makeStyles,
  TextField,
  IconButton,
  Box,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormInputRooms(props) {
  const classes = useStyles();
  const [roomElements, setRoomElements] = useState();
  const { title, roomsInput, setRoomsInput } = props;

  const onChange = (e) => {
    const newRoomsInput = { ...roomsInput };
    newRoomsInput[e.target.id] = e.target.value;
    setRoomsInput({
      type: "update",
      key: e.target.id,
      value: e.target.value,
    });
  };

  const deleteRoomsInput = (e) => {
    setRoomsInput({
      type: "delete",
      key: e.currentTarget.id,
    });
  };

  useEffect(() => {
    setRoomElements(
      Object.entries(roomsInput.rooms).map(([key, value]) => {
        return (
          <Box key={`${key}-box`} display="flex" width="100%">
            <TextField
              id={key}
              style={{ margin: 8 }}
              placeholder={title}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={value}
              onChange={onChange}
              size="small"
            />
            <IconButton
              id={key}
              aria-label="delete"
              color="secondary"
              onClick={deleteRoomsInput}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })
    );
    return () => {};
  }, [title, roomsInput]);

  return (
    <div>
      <FormControl className={classes.formControl}>
        {roomElements}
      </FormControl>
    </div>
  );
}
StartFormInputRooms.propTypes = {
  title: PropTypes.string.isRequired,
  roomsInput: PropTypes.shape({
    maxId: PropTypes.number.isRequired,
    rooms: PropTypes.shape({}),
  }).isRequired,
  setRoomsInput: PropTypes.func.isRequired,
};
