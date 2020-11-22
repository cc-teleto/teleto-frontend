import { FormControl, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormInput(props) {
  const classes = useStyles();

  return (
    <div>
      <FormControl className={classes.formControl}>
      <TextField
          name={props.field.name}
          style={{ margin: 8 }}
          placeholder={props.field.title}
          helperText=",(カンマ区切り)で入力してください"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={props.field.state}
          onChange={props.dispatch}
        />
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
}
