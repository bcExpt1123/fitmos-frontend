import React,{useState} from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, IconButton} from "@material-ui/core";
import { Row, Col} from "react-bootstrap";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
export default function WorkoutEditDialog(props) {
  const [file,setFile] = useState(null);
  const [hash,setHash] = useState(Date.now());
  const handleCapture = ({ target })=> {
    let file = URL.createObjectURL(target.files[0]);
    setFile(file);
    props.updateImage(target.files);
  }
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
          Please write down workout content and upload an image
        </DialogContentText>
        <Row>
          <Col sm={6}>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label=""
                type="email"
                multiline={true}
                rows={26}
                rowsMax={28}
                value={props.content}
                onChange={props.handleChange}
                fullWidth
            />
          </Col>
          <Col sm={6}>
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