import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Select, InputLabel, FormControl, MenuItem } from "@material-ui/core/";

const MAX_PERIOD = 3;
const PERIOD_INTERVAL = 0.5;

// 開催時間の選択リストを作成する
const periodSelectList = _.range(
  PERIOD_INTERVAL,
  MAX_PERIOD + PERIOD_INTERVAL,
  PERIOD_INTERVAL
).map((hour) => {
  return (
    <MenuItem name="period" value={hour} key={hour}>
      {hour}時間
    </MenuItem>
  );
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormSelect(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { title, periodInput, onChange } = props;

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
          value={periodInput}
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
  periodInput: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
