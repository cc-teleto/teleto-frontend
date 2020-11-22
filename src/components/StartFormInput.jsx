import {
  FormControl,
  makeStyles,
  TextField,
  IconButton,
  Box
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useEffect } from "react";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormInput(props) {
  const classes = useStyles();
  const [memberElements, setMemberElements] = useState();

  useEffect(() => {
    setMemberElements(
      Object.entries(props.value.members).map((kv) => {
        return (
          <Box key={`${kv[0]}-box`} display="flex" width="100%">
            <TextField
              name={kv[0]}
              style={{ margin: 8 }}
              placeholder={props.title}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={kv[1]}
              onChange={props.changeDispatch}
              size="small"
            />
            <IconButton name={kv[0]} aria-label="delete" color="secondary" onClick={props.deleteDispatch}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })
    );
  }, [props.value, props.name, props.title, props.changeDispatch, props.deleteDispatch]);

  return (
    <div>
      <FormControl className={classes.formControl}>
        {memberElements}
      </FormControl>
    </div>
  );
}

StartFormInput.defaultProps = {
  field: {
    name: "",
    title: "",
    state: "",
  },
  dispatch: () => {},
};
