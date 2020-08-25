import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styles, Button, Paper, MenuItem, Select, Grid, Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import {
  $saveItem,
  $updateItemValue,
  $fetchSetting,
} from "../../../modules/subscription/permission";

const useStyles = () => {
  return styles.makeStyles(theme => ({
    root: {
      display: "block",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    margin: {
      margin: theme.spacing(1)
    }
  }));
};

const Permissions = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const permission = useSelector(({permission})=>permission);
  useEffect(() => {
    dispatch($fetchSetting());
  });
  const handleOnSubmit = e =>{
    e.preventDefault();
    dispatch($saveItem());
    return false;
  };
  const handleChange = name=> {
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {permission.item ? (
        <form
          id="permission-settings-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={10}  style={{display:'flex',alignItems:'flex-end'}}>
              <TextField
                id="time"
                label="Time"
                className={classes.textField}
                value={permission.item.time}
                type="number"
                style={{width:'360px'}}
                onChange={handleChange("time")}
                margin="normal"
              />
              <Select
                  id="unit"
                  value={permission.item.unit}
                  onChange={handleChange("unit")}
                  style={{margin:'0 0 8px 0'}}
                >
                <MenuItem value="h">H</MenuItem>
                <MenuItem value="d">D</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={10}>
              <FormControlLabel
                label={
                  <>
                    I agree the{" "}
                  </>
                }
                control={
                  <Checkbox
                    color="primary"
                    name="acceptTerms"
                    //onBlur={handleBlur}
                    onChange={handleChange}
                    checked={permission.item.set}
                  />
                }
              />
            </Grid>
          </Grid>
        </form>
      ) : (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
        </h3>
      )}
    </Paper>
  )
}

const SubHeaderPermissions = () => {
  const isSaving = false;
  const dispatch = useDispatch();
  const handleReset = ()=>{
    dispatch($fetchSetting());
  }
  return (
    <>
      <div className="kt-subheader__main">
        {false && (
          <button
            className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
            id="kt_subheader_mobile_toggle"
          >
            <span />
          </button>
        )}
        <h3 className="kt-subheader__title">Role & Permissions</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <Button
            className="btn kt-subheader__btn-primary btn-primary"
            form="cart-settings-form"
            type="submit"
            disabled={isSaving}
          >
            Submit &nbsp;
          </Button>
          <Button
            className="btn kt-subheader__btn-primary btn-primary"
            form="cart-settings-form"
            type="button"
            disabled={isSaving}
            onClick={handleReset}
          >
            Reset &nbsp;
          </Button>
        </div>
      </div>
    </>
  );
}
export { Permissions, SubHeaderPermissions };
