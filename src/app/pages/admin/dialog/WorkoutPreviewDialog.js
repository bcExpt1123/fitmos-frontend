import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Markup } from "interweave";

export default function WorkoutPreviewDialog(props) {
  return(
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-workout-preview-title"
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle id="form-dialog-workout-preview-title">
        {props.title}
        {props.subTitle}
      </DialogTitle>
      <DialogContent>
        <Row>
          <Col sm={6}>
            <h4>Email Preview</h4>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {props.content && (
                <Markup content={props.content[0]} />
              )}
            </div>
          </Col>
          <Col sm={6}>
            <h4>Whatsapp Preview</h4>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {props.whatsapp && props.whatsapp[0]}
            </div>
          </Col>
        </Row>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>

  )
}