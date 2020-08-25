import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { InputLabel, MenuItem, FormControl, TextField, Select, Grid, Button} from "@material-ui/core";
import {
  $saveItem,
  $updateItemValue,
  $fetchSetting,
} from "../../../../../modules/subscription/cartSetting";

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
  const isSaving = false;
  const handleReset = ()=>{
    dispatch($fetchSetting());
  }
  const cartSetting = useSelector(({cartSetting})=>cartSetting);
  useEffect(() => {
    dispatch($fetchSetting());
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
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
    <>
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
                      <MenuItem key={coupon.id} value={coupon.id}>{coupon.code}</MenuItem>
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
                      <MenuItem key={coupon.id} value={coupon.id}>{coupon.code}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={10}>
              <Button
                className="btn kt-subheader__btn-primary btn-primary mr-5"
                form="cart-settings-form"
                type="submit"
                disabled={isSaving}
              >
                Submit &nbsp;
              </Button>
              <Button
                className="btn kt-subheader__btn-primary btn-primary ml-5"
                form="cart-settings-form"
                type="button"
                disabled={isSaving}
                onClick={handleReset}
              >
                Reset &nbsp;
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
        </h3>
      )}
    </>
  )
}

export default CartSettings;