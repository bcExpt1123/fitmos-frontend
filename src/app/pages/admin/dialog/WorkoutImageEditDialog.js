import React,{useState,useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";


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
                <img src={file} width="200px" />
              ) : (
                props.image&&(
                  <img src={`${props.image}?${hash}`} width="200px" />
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