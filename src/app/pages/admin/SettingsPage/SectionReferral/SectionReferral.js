import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { TextField, Grid, Button } from "@material-ui/core";
import { http } from "../../../home/services/api";

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

const ReferralSettings = () => {
  const classes = useStyles();
  const [isLoading,setIsLoading] = useState(false);
  const [discount,setDiscount] = useState(false);
  const [originDiscount,setOriginDiscount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handleReset = ()=>{
    setDiscount(originDiscount);
  }
  
  useEffect( () => {
    async function fetchData(){
      const res = await http({
        path: "setting/referral-discount"
      });
      if(res.data){
        setDiscount(res.data.discount);
        setOriginDiscount(res.data.discount);
      }
    }
    setIsLoading(true);
    fetchData();
  },[]);
  const handleOnSubmit = async (e) =>{
    e.preventDefault();
    setIsSaving(true);
    const res = await http({
      method: "POST",
      path: "setting/update-referral-discount",
      data: {
        discount
      }
    });    
    setOriginDiscount(discount);
    setIsSaving(false);
    return false;
  };
  const handleChange = (event)=> {
    setDiscount(event.target.value);
  }
  return (
    <>
      {isLoading ? (
        <form
          id="cart-settings-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                id="discount"
                label="Discount(%)"
                className={classes.textField}
                value={discount}
                type="number"
                style={{width:'360px'}}
                onChange={handleChange}
                margin="normal"
              />
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

export default ReferralSettings;