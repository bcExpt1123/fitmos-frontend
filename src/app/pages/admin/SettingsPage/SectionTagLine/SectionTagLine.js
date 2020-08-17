import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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

const TagLineSettings = () => {
  const classes = useStyles();
  const [isLoading,setIsLoading] = useState(false);
  const [tagLine,setTagLine] = useState(false);
  const [originTagLine,setOriginTagLine] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handleReset = ()=>{
    setTagLine(originTagLine);
  }
  
  useEffect( () => {
    async function fetchData(){
      const res = await http({
        path: "setting/tag-line"
      });
      if(res.data){
        setTagLine(res.data.tagLine);
        setOriginTagLine(res.data.tagLine);
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
      path: "setting/update-tag-line",
      data: {
        tagLine
      }
    });
    setOriginTagLine(tagLine);
    setIsSaving(false);
    return false;
  };
  const handleChange = (event)=> {
    setTagLine(event.target.value);
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
                id="tag-line"
                label="Tag Line"
                className={classes.textField}
                value={tagLine}
                type="text"
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

export default TagLineSettings;