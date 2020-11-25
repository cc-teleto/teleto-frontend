import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Select, InputLabel, FormControl, MenuItem } from "@material-ui/core/";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormSelect(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { title, stateInput, onChange, selectMap } = props;
  const periodSelectList = selectMap.map(({ name, value }) => {
    return (
      <MenuItem name={name} value={value} key={value}>
        {name}
      </MenuItem>
    );
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel name="period-label">{title}</InputLabel>
        <Select
          labelId="period-label"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={stateInput}
          onChange={onChange}
        >
          {periodSelectList}
        </Select>
      </FormControl>
    </div>
  );
}

StartFormSelect.propTypes = {
  title: PropTypes.string.isRequired,
  stateInput: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onChange: PropTypes.func.isRequired,
  selectMap: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};
