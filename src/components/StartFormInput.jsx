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

export default function StartFormInput(props) {
  const classes = useStyles();
  const [memberElements, setMemberElements] = useState();
  const { title, membersInput, setMembersInput } = props;

  const onChange = (e) => {
    const newMembersInput = { ...membersInput };
    newMembersInput[e.target.id] = e.target.value;
    setMembersInput({
      type: "update",
      key: e.target.id,
      value: e.target.value,
    });
  };

  const deleteMembersInput = (e) => {
    setMembersInput({
      type: "delete",
      key: e.currentTarget.id,
    });
  };

  useEffect(() => {
    setMemberElements(
      Object.entries(membersInput.members).map(([key, value]) => {
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
              onClick={deleteMembersInput}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })
    );
    return () => {};
  }, [title, membersInput]);

  return (
    <div>
      <FormControl className={classes.formControl}>
        {memberElements}
      </FormControl>
    </div>
  );
}
StartFormInput.propTypes = {
  title: PropTypes.string.isRequired,
  membersInput: PropTypes.shape({
    maxId: PropTypes.number.isRequired,
    members: PropTypes.shape({}),
  }).isRequired,
  setMembersInput: PropTypes.func.isRequired,
};
