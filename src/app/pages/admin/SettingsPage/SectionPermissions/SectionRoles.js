import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {Button} from "react-bootstrap";
import {Modal } from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
import { Table, TableHead, TableBody, TableCell, TableRow, IconButton, TextField, Grid} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {
  $updateItemValue,
  $saveItemRole,
  $setNewItemRole,
  $deleteRole,
  $editRole
} from "../../../../../modules/subscription/permission";

const useStyles = makeStyles(theme => ({
}));
const headRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];

const SectionRoles = ({show,handleClose})=> {
  const classes = useStyles();
  const dispatch = useDispatch();
  const roles = useSelector(({permission})=>permission.roles);
  const role = useSelector(({permission})=>permission.roleItem);
  const errors = useSelector(({permission})=>permission.errors);
  const actionDelete = id => event => {
    $deleteRole(id);
  };
  const actionEdit = id => event => {
    dispatch($editRole(id));
  };
  const handleOnSubmit = ()=>{
    dispatch($saveItemRole());
  }
  const handleChange = (name)=> {
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  const handleShow = ()=>{
    dispatch($setNewItemRole());
  }
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      centered
      onShow={handleShow}
      className="edit-benchbark"
    >
      <Modal.Header closeButton>
        <Modal.Title className="">Roles Manage</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          id="role-form"
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                id="name"
                label="Name"
                error={errors.name.length === 0 ? false : true}
                helperText={errors.name}
                className={classes.textField}
                value={role.name}
                onChange={handleChange("name")}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button type="button" variant="edit" onClick={handleOnSubmit}>
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {headRows.map(row => (
                <TableCell
                  key={row.id}
                  align={"left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={false}
                >
                  {row.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles != null &&
              roles.map(row => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left" style={{ padding: "0" }}>
                    <IconButton
                      color="secondary"
                      className={classes.button}
                      aria-label="Edit"
                      title="Edit"
                      onClick={actionEdit(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      className={classes.button}
                      aria-label="Delete"
                      title="Delete"
                      onClick={actionDelete(row.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

          </TableBody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};
export default SectionRoles;
