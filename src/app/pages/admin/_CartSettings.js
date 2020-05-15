import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import {
  $saveItem,
  $updateItemValue,
  $fetchSetting,
} from "../../../modules/subscription/cartSetting";

const useStyles = () => {
  return makeStyles(theme => ({
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

const CartSettings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cartSetting = useSelector(({cartSetting})=>cartSetting);
  useEffect(() => {
    dispatch($fetchSetting());
  },[]);
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
      {cartSetting.item ? (
        <form
          id="cart-settings-form"
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
                value={cartSetting.item.time}
                type="number"
                style={{width:'360px'}}
                onChange={handleChange("time")}
                margin="normal"
              />
              <Select
                  id="unit"
                  value={cartSetting.item.unit}
                  onChange={handleChange("unit")}
                  style={{margin:'0 0 8px 0'}}
                >
                <MenuItem value="h">H</MenuItem>
                <MenuItem value="d">D</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={10}>
              <FormControl className={classes.formControl}>
                <InputLabel id="new-customer-coupon-label" style={{top:'16px'}}>Coupon for New Customer</InputLabel>
                <Select
                  labelId="new-customer-coupon-label"
                  id="new-customer-coupon"
                  value={cartSetting.item.new_coupon_id}
                  onChange={handleChange("new_coupon_id")}
                  style={{width:'400px',marginTop:'32px'}}
                >
                  <MenuItem value="">None</MenuItem>
                  {
                    cartSetting.coupons.map(coupon=>(
                      <MenuItem key={coupon.id} value={coupon.id}>{coupon.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={10}>
              <FormControl className={classes.formControl}>
                <InputLabel id="renewal-customer-coupon-label" style={{top:'16px'}}>Coupon for Renewal Customer</InputLabel>
                <Select
                  labelId="renewal-customer-coupon-label"
                  id="renewal-customer-coupon"
                  value={cartSetting.item.renewal_coupon_id}
                  onChange={handleChange("renewal_coupon_id")}
                  style={{width:'400px',marginTop:'32px'}}
                >
                  <MenuItem value="">None</MenuItem>
                  {
                    cartSetting.coupons.map(coupon=>(
                      <MenuItem key={coupon.id} value={coupon.id}>{coupon.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
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

const SubHeaderCartSettings = () => {
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
        <h3 className="kt-subheader__title">Abandon Cart Settings</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <Button
            type="button"
            className="btn kt-subheader__btn-primary btn-primary"
            form="cart-settings-form"
            type="submit"
            disabled={isSaving}
          >
            Submit &nbsp;
          </Button>
          <Button
            type="button"
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
export { CartSettings, SubHeaderCartSettings };
