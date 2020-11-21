import { FormControl, makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function StartFormInput(props) {
  const classes = useStyles();

  const onChange = (e) => {
    props.dispatch(e.target.value)
  }
  return (
    <div>
      <FormControl className={classes.formControl}>
        <TextField
          id={props.field.id}
          label={props.field.name}
          variant="outlined"
          size="small"
          value={props.field.state}
          onChange={onChange}
        />
      </FormControl>
    </div>
  );
}

StartFormInput.defaultProps = {
  field: {
    id: "",
    name: "",
    state: "",
  },
  dispatch: () => {},
}
