import React,{useState,useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle, TextField, Button, InputLabel, MenuItem, FormControl, Select} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import {Row, Col} from "react-bootstrap";
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
          Please write down workout content and note, timer
        </DialogContentText>
        <Row className="mb-5 pb-5">
          <Col sm={5}>
            <label>Workout</label>
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
          <Col sm={5}>
            <label>Note</label>
            <ReactTextareaAutocomplete
              className="note"
              onChange={props.handleNoteChange}
              loadingComponent={() => <span>Loading</span>}
              value={props.note}
              minChar={0}
              trigger={{
                "@": {
                  dataProvider: token => {
                    return items;
                  },
                  component: Item,
                  output: (item, trigger) => item.name
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
                <MenuItem value="amrap">Amrap</MenuItem>
                <MenuItem value="for_time">For time</MenuItem>
                <MenuItem value="tabata">Tabata</MenuItem>
                <MenuItem value="calentamiento">Calentamiento</MenuItem>
                <MenuItem value="extra">Extra Workout</MenuItem>
              </Select>
            </FormControl>            
            {props.timerType&&(
              <>{
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
                    value={(props.work==="" && (props.timerType === "calentamiento" || props.timerType==="extra"))?30:props.work}
                    onChange={props.handleTimerWorkChange}
                    type="number"
                    label="Work Time(Minutes)"
                  />
                </div>
              )
              }
                <TextField
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Timer Description"
                  multiline={true}
                  rows={6}
                  rowsMax={10}
                  value={props.description}
                  onChange={props.handleTimerDescriptionChange}
                  fullWidth
                /> 
              </>              
            )} 
          </Col>
        </Row>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}