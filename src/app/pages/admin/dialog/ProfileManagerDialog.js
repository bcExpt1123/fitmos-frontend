import React,{useState, useEffect, useMemo } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Grid, Typography } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { mutate } from 'swr'
import { useDispatch, useSelector } from "react-redux";
import { Row, Col} from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
import throttle from 'lodash/throttle';
import { http } from '../../home/services/api';


const useStyles = ()=>{
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
}
export default function ProfileManagerDialog(props) {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();
  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        http({
          path:'customers?pageSize=100&pageNumber=0&search='+request.input
        }).then(res=>callback(res.data.data))
      }, 200),
    [],
  );
  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }
    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });
    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const handleClose = ()=>{
    props.handleClose();
  }
  const handleSave = ()=>{
    http({
      path:'profile-managers',
      method:'POST',
      data:{
        customer_id:value.id
      }
    }).then(res=>{
      mutate('profile-managers');
      props.handleClose();
    })
  }
  return(
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-workout-edit-title"
      fullWidth={false}
      maxWidth="lg"
    >
      <DialogTitle id="form-dialog-workout-edit-title">
        New Profile Manager
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please write down workout content.
        </DialogContentText>
        <Row>
          <Col sm={12}>
          <Autocomplete
            id="customer"
            style={{ width: 362, height:300 }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.username)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
              if(newValue && newValue.username){
              }
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="customer name" variant="outlined" fullWidth />
            )}
            renderOption={(option) => {
              return (
                <Grid container alignItems="center">
                  <Grid item xs>
                    {option.username}
                    <Typography variant="body2" color="textSecondary">
                      {option.first_name} {option.last_name} {option.email}
                    </Typography>
                  </Grid>
                </Grid>
              );
            }}
          />
          </Col>
        </Row>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}