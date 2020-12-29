import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue
} from "../../../modules/subscription/linkCoupons";
import { validateEmail } from "../../../modules/validate.js";
import { makeStyles } from "@material-ui/core";
import { Button, Paper, InputLabel, MenuItem, FormControl, TextField, Select, Grid, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
const useStyles = ()=> {
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
    },
    radioGroup:{
      display:"block",
    }
  }));
}

function LinkCouponCreate(){
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [mail, setMail] = useState("");
  const handleOnSubmit = e => {
    e.preventDefault();
    if (
      item.mail == null ||
      item.mail === "" ||
      validateEmail(item.mail)
    ) {
      setMail("");
      dispatch($saveItem(history));
    } else {
      // this.setState({ mail: "Invalid email" });
    }
    return false;
  };
  const handleChange = (name)=>{
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  const item = useSelector(({linkCoupon})=>linkCoupon.item);
  const isloading = useSelector(({linkCoupon})=>linkCoupon.isloading);
  const errors = useSelector(({linkCoupon})=>linkCoupon.errors);
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {item ? (
        <form
          id="coupon-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                required
                id="code"
                label="Name"
                error={errors.code.length === 0 ? false : true}
                helperText={errors.code}
                className={classes.textField}
                value={item.code}
                onChange={handleChange("code")}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="expiration"
                label="Membership Expiration"
                className={classes.textField}
                value={item.expiration}
                type="date"
                onChange={handleChange("expiration")}
                margin="normal"
              />
            </Grid>
          </Grid>  
          <br/>
          <br/>
          <hr/>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{display:'flex',alignItems:'flex-end'}}>
              <RadioGroup aria-label="gender" name="gender1" value={item.type} onChange={handleChange("type")} style={{display:"block"}}>
                <FormControlLabel value="InvitationEmail" control={<Radio />} label="Invitation by email" />
                <FormControlLabel value="InvitationCode" control={<Radio />} label="Invitation by code" />
              </RadioGroup>              
            </Grid>
            {item.type == 'InvitationEmail'?
              (
                <Grid item xs={12}>
                  <TextField
                    id="email-list"
                    required
                    label="Enter emails to send invitation..."
                    multiline
                    rows={8}
                    onChange={handleChange("email_list")}
                    style={{width:"400px"}}
                    value={item.email_list}
                  />
                </Grid>
              ):(
                <Grid item xs={6}>
                  https://www.fitemos.com/signup?codigo={item.code}
                  <TextField
                    id="max_use"
                    label="Max uses"
                    type="number"
                    className={classes.textField}
                    value={item.max_user_count}
                    onChange={handleChange("max_user_count")}
                    margin="normal"
                  />               
                </Grid>
              )  
            }
          </Grid>
        </form>
      ) : isloading ? (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
        </h3>
      ) : (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          The Item doesn't exist
        </h3>
      )}
    </Paper>
  );
}

function SubHeaderLinkCouponCreate(){
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch($setNewItem());
  },[]);
  const item = useSelector(({linkCoupon})=>linkCoupon.item);
  const isSaving = useSelector(({linkCoupon})=>linkCoupon.isSaving);
  const history = useHistory();
  return (
    <>
      <div className="kt-subheader__main">
        <h3 className="kt-subheader__title">New Coupon</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <Button
            className="btn kt-subheader__btn-primary btn-primary"
            form="coupon-form"
            type="submit"
            disabled={isSaving}
          >
            Submit &nbsp;
          </Button>
          <Button
            type="button"
            className="btn kt-subheader__btn-primary btn-primary"
            onClick={history.goBack}
          >
            Back &nbsp;
          </Button>
        </div>
      </div>
    </>
  );
}
export { LinkCouponCreate, SubHeaderLinkCouponCreate };
