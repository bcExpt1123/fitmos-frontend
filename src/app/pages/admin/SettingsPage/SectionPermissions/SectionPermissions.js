import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { MenuItem, FormControl, InputLabel, Select, Grid, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import SectionRoles from "./SectionRoles";
import {
  $saveItem,
  $chooseRole,
  $fetchSetting,
  $updatePermissionsValue,
} from "../../../../../modules/subscription/permission";

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

const Permissions = () => {
  const isSaving = false;
  const classes = useStyles();
  const dispatch = useDispatch();
  const permission = useSelector(({permission})=>permission);
  const [show,setShow] = useState(false);
  useEffect(() => {
    dispatch($fetchSetting());
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const handleReset = ()=>{
    dispatch($fetchSetting());
  }
  const handleOnSubmit = e =>{
    e.preventDefault();
    dispatch($saveItem());
    return false;
  };
  const handleChange = name=> {
    return event => {
      dispatch($chooseRole(event.target.value));
    };
  }
  const handleChangePermission = p=>{
    return event => {
      dispatch($updatePermissionsValue(p,permission.item));
    }
  }
  const checkPermissions = id =>{
    if(permission.item.permissions){
      const length = permission.item.permissions.length;
      let i = 0;
      for(i=0;i<length;i++){
        if(permission.item.permissions[i].id === id){
          return true;
        }
      }
    }
    return false;
  }
  const handleShow = ()=> {
    setShow(true);
  }
  const handleClose = ()=> {
    setShow(false);
  }

  return (
    <>
      <br />
      {permission.roles.length>0 ? (
        <form
          id="permission-settings-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={12} sm={3}  style={{display:'flex',alignItems:'flex-end'}}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Role">Role</InputLabel>
                <Select
                    id="role"
                    value={permission.item.id}
                    onChange={handleChange("id")}
                  >
                  {
                    permission.roles.map(role=>(
                      <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Button
                type="button"
                className="btn kt-subheader__btn-primary btn-secondary mt-5"
                onClick={handleShow}
              >
                Manage
              </Button>
            </Grid>
            {
              permission.permissions.map(permission=>(
                <Grid item xs={12} sm={3}  key={permission.id}>
                  <FormControlLabel
                    label={
                      <>
                        {permission.name}
                      </>
                    }
                    control={
                      <Checkbox
                        color="primary"
                        name="permissions"
                        //onBlur={handleBlur}
                        onChange={handleChangePermission(permission)}
                        checked={checkPermissions(permission.id)}
                      />
                    }
                  />
                </Grid>
              ))
            }
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}></Grid>
            <Grid item xs={10}>
              <Button
                className="btn kt-subheader__btn-primary btn-primary mr-5"
                form="permission-settings-form"
                type="submit"
                disabled={isSaving}
              >
                Submit &nbsp;
              </Button>
              <Button
                className="btn kt-subheader__btn-primary btn-primary ml-5"
                form="permission-settings-form"
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
      <SectionRoles
        handleClose={handleClose}
        show={show}
      />
    </>
  )
}

export default Permissions;
