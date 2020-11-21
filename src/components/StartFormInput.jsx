import { FormControl, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormInput() {
  const classes = useStyles();
  const [field, setField] = useState("");

  const onChange = (e) => {
    console.log(e.target.value);
  }
  return (
    <div>
      <FormControl className={classes.formControl}>
        <TextField
          id="filled-basic"
          label="field"
          variant="outlined"
          size="small"
          value={field}
          color="secondary"
          onChange={onChange}
        />
      </FormControl>
    </div>
  );
}
