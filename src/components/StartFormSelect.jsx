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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel name={`${props.field.name}-label`}>{props.field.title}</InputLabel>
        <Select
          labelId={`${props.field.name}-label`}
          name={props.field.name}
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={props.field.state}
          onChange={props.dispatch}
        >
          {props.selectList}
        </Select>
      </FormControl>
    </div>
  );
}

StartFormSelect.defaultProps = {
  field: {
    name: "",
    title: "",
    state: "",
  },
  dispatch: () => {},
  selectList: [],
}
