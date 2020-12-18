import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  $changeItem,
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

function LinkCouponShow(){
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
        <>
          <div className="row">
            <div className="col-6">
              <label className="font-weight-bold">Name:</label>
              <div>{item.code}</div>
            </div>
            {item.expiration&&(
              <div className="col-6">
                <label className="font-weight-bold">Expiration:</label>
                <div>{item.expiration}</div>
              </div>
            )}
          </div>
          {
            item.type=="InvitationEmail"&&(
              <>
                <div className="row pt-3">
                  <div className="col-6">
                    <label className="font-weight-bold">Emails:</label>
                    {
                      item.emails&&item.emails.map(email=>(
                        <div key={email.id}>
                          {email.email}
                          {email.used=="yes"&&<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>used</b></span>}
                        </div>
                      ))  
                    }
                  </div>  
                </div>
              </>
            )
          }
          {
            item.type=="InvitationCode"&&(
            <>
              <div className="row pt-3">
                <div className="col-6">
                  <label className="font-weight-bold">Max Use Count:</label>
                  <div>{item.max_user_count}</div>
                </div>  
                <div className="col-6">
                  <label className="font-weight-bold">Current Use Count:</label>
                  <div>{item.current_user_count}</div>
                </div>  
              </div>
              <div className="row pt-3">
                <div className="col-6">
                  <label className="font-weight-bold">Referral link:</label>
                  <div>https://www.fitemos.com/signup?codigo={item.code}</div>
                </div>  
              </div>
            </>
          )
        }
        </>
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

function SubHeaderLinkCouponShow({match}){
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch($changeItem(match.params.id));
  },[]);
  const item = useSelector(({linkCoupon})=>linkCoupon.item);
  const history = useHistory();
  return (
    <>
      <div className="kt-subheader__main">
        <h3 className="kt-subheader__title">{item&&item.name}</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
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
export { LinkCouponShow, SubHeaderLinkCouponShow };
