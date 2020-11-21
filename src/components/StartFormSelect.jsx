import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormSelect(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    props.dispatch(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id={`${props.field.id}-label`}>{props.field.name}</InputLabel>
        <Select
          labelId={`${props.field.id}-label`}
          id={props.field.id}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={props.field.state}
          onChange={handleChange}
        >
          {props.selectList}
        </Select>
      </FormControl>
    </div>
  );
}

StartFormSelect.defaultProps = {
  field: {
    id: "",
    name: "",
    state: "",
  },
  dispatch: () => {},
  selectList: [],
}
