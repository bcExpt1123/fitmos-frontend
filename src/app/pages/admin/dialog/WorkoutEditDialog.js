import React,{useState, useEffect} from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Select, InputLabel, MenuItem, FormControl, IconButton} from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col} from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/style.css";
import {actionTypes} from "../../../../modules/subscription/shortcode";
import {actionTypes as actions} from "../../../../modules/subscription/keyword";


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
export default function WorkoutEditDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [textareaEl,setTextAreaEl] = useState(false);
  useEffect(()=>{
    if(!items){
      dispatch({type:actionTypes.SHORTCODE_UPDATE_LIST});
    }
    if(!keywords){
      dispatch({type:actions.KEYWORD_UPDATE_LIST});
    }
  },[]);
  useEffect(()=>{
    if(textareaEl)textareaEl.focus();
  },[textareaEl]);
  const Item = ({ entity: { name} }) => <div>{`${name}`}</div>;
  const items = useSelector(({shortcode})=>shortcode.all);
  const keywords = useSelector(({keyword})=>keyword.all);
  const autocomplete = (token)=>{
    return items.filter((item,index)=>{
      return item.name.toLowerCase().startsWith(token.substr(0).toLowerCase());
    }).slice(0,10);
  }
  const autocompleteKeyword = (token)=>{
    return keywords.filter((item,index)=>{
      return item.name.toLowerCase().startsWith(token.substr(0).toLowerCase());
    }).slice(0,10);
  }
  const [file,setFile] = useState(null);
  const [hash,setHash] = useState(Date.now());
  const handleCapture = ({ target })=> {
    let file = URL.createObjectURL(target.files[0]);
    setFile(file);
    props.updateImage(target.files);
  }
  const isSaving = useSelector(({weekWorkout})=>weekWorkout.isSaving);
  const handleClose = ()=>{
    props.handleClose();
    setFile(null);
  }
  const handleSave = ()=>{
    props.handleSave();
    setFile(null);
    setTimeout(()=>{
      setHash(Date.now());
    },1000);
  }
  return(
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-workout-edit-title"
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle id="form-dialog-workout-edit-title">
        {props.title}&nbsp;&nbsp;{props.subTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please write down workout content.
        </DialogContentText>
        <Row>
          <Col sm={5}>
          <ReactTextareaAutocomplete
              className="content"
              onChange={props.handleChange}
              loadingComponent={() => <span>Loading</span>}
              value={props.content}
              innerRef = {textarea=>{
                setTextAreaEl(textarea)
              }}
              minChar={0}
              trigger={{
                "@": {
                  dataProvider: token => {
                    return autocomplete(token);
                  },
                  component: Item,
                  output: (item, trigger) => "{"+item.name+"}"
                },
                "(": {
                  dataProvider: token => {
                    return autocompleteKeyword(token);
                  },
                  component: Item,
                  output: (item, trigger) => item.name
                }                
              }}
            />            
          </Col>
          {props.imageEnable&&
            <Col sm={5}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleCapture}
              />
              <label htmlFor="raised-button-file">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <div>
                {file ? (
                  <img src={file} alt='props' width="200px" />
                ) : (
                  props.image&&(
                    <img src={`${props.image}?${hash}`} alt="props" width="200px" />
                  )
                )}
              </div>
            </Col>
          }
          <Col sm={2}>
            <FormControl className={classes.formControl}>
              <InputLabel id="new-customer-coupon-label">Timer Types</InputLabel>
              <Select
                labelId="new-customer-coupon-label"
                id="default"
                value={props.timerType}
                onChange={props.handleTimerTypeChange}
                style={{width:'150px'}}
              >
                <MenuItem value="null">No Timer</MenuItem>
                <MenuItem value="amrap">Amrap</MenuItem>
                <MenuItem value="for_time">For time</MenuItem>
                <MenuItem value="tabata">Tabata</MenuItem>
              </Select>
            </FormControl>            
            {props.timerType&&props.timerType != "null"&&(
              props.timerType === "tabata"?(
                <div>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="round"
                    value={props.round}
                    onChange={props.handleTimerRoundChange}
                    type="number"
                    label="Round"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="work"
                    value={props.work}
                    onChange={props.handleTimerWorkChange}
                    type="number"
                    label="Work Time(Seconds)"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="rest"
                    value={props.rest}
                    onChange={props.handleTimerRestChange}
                    type="number"
                    label="Rest Time(Seconds)"
                  />
                </div>
              ):(
                <div>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="workout"
                    value={props.work}
                    onChange={props.handleTimerWorkChange}
                    type="number"
                    label="Work Time(Minutes)"
                  />
                </div>
              )
            )}  
          </Col>
        </Row>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={isSaving}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}