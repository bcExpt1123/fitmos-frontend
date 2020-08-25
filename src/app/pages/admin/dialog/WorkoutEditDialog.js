import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Select, InputLabel, MenuItem, FormControl} from "@material-ui/core";
import { Row, Col} from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
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
          <Col sm={9}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label=""
              multiline={true}
              rows={26}
              rowsMax={28}
              value={props.content}
              onChange={props.handleChange}
              fullWidth
            />
          </Col>
          <Col sm={3}>
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
              </Select>
            </FormControl>            
            {props.timerType&&(
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