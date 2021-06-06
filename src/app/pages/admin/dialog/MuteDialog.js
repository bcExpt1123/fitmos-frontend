import React,{useState, useEffect } from "react";
import { useFormik } from 'formik';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, Grid, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { Row, Col} from "react-bootstrap";
import { http } from '../../home/services/api';
import { $changeItem } from "../../../../modules/subscription/customer";

export default function MuteDialog({open, handleClose, customer}) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      reason: '',
      days: 10,
    },
    onSubmit: (values) => {
      http({
        path:'admin-actions',
        method:'POST',
        data:{
          customer_id:customer.id,
          type:'mute',
          reason:values.reason,
          days:values.days
        }
      }).then(res=>{
        dispatch($changeItem(customer.id));
        handleClose();
      })      
    }
  });
  return(
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-workout-edit-title"
      fullWidth={false}
    >
      <DialogTitle id="form-dialog-workout-edit-title">
        Mute {customer.first_name} {customer.last_name}({customer.email})
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please write down Mute reason.
        </DialogContentText>
        <Row>
          <Col sm={12}>
            <form onSubmit={formik.handleSubmit} id="muteAction">
              <TextField
                fullWidth
                id="reason"
                multiline={true}
                rows="3"
                name="reason"
                label="Reason"
                value={formik.values.reason}
                required
                onChange={formik.handleChange}
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={formik.touched.reason && formik.errors.reason}
              />
              <TextField
                fullWidth
                id="days"
                name="days"
                label="Days"
                type="number"
                value={formik.values.days}
                required
                onChange={formik.handleChange}
                error={formik.touched.days && Boolean(formik.errors.days)}
                helperText={formik.touched.days && formik.errors.days}
              />
            </form>            
          </Col>
        </Row>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" form="muteAction" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}