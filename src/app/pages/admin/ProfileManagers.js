import React, { useEffect, useState } from "react";
import useSWR, { mutate } from 'swr';
import { injectIntl } from "react-intl";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core";
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Paper, IconButton, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { httpApi, http } from "../home/services/api";
import ProfileManagerDialog from "./dialog/ProfileManagerDialog";

const useStyles = makeStyles( theme => ({
  table: {
    minWidth: 500
  },
  exportSpinner:{
    marginBottom:'-5px'
  }
}));
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Username"
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email"
  },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "country", numeric: false, disablePadding: false, label: "Country" },
  // { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];

const Main =() =>{
  const { data } = useSWR('profile-managers', httpApi);
  const classes = useStyles();
  const customers = data?.data;
  
  const emptyRows = 0;
  const actionDelete = (id)=>()=>{
    if(window.confirm('Are you sure to delete this profile manager ')){
      http({
        path:'profile-managers/'+id,
        method:'DELETE'
      }).then(res=>{
        mutate('profile-managers');
      })
    }
  }
	return(
		<Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {headRows.map(row => (
                <TableCell
                  key={row.id}
                  align={row.numeric ? "right" : "left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={false}
                >
                  {row.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers != null &&
              customers.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.username}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.country}</TableCell>
                  {/* <TableCell align="left">
                    <span
                      className={classnames(
                        " btn btn-bold btn-xs btn-font-sm normal",
                        {
                          "btn-label-success": row.status === "Active",
                          "btn-label-danger": row.status === "Inactive"
                        }
                      )}
                    >
                      {row.status}
                    </span>
                  </TableCell> */}
                  <TableCell align="left" style={{ padding: "0" }}>
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

            {customers && customers.length == 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} >There are no managers</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Paper>
	);
};
const ProfileManagers = injectIntl(Main);

function Sub() {
  const [show, setShow] = useState(false);
  const openDialog = ()=>{
    setShow(true);
  }
  const onClose = ()=>{
    setShow(false);
  }
	return (
		<>
			<div className="kt-subheader__main">
				{false && (
					<button
						className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
						id="kt_subheader_mobile_toggle"
					>
						<span />
					</button>
				)}
        <h3 className="kt-subheader__title">Profile Managers</h3>
				<span className="kt-subheader__separator kt-subheader__separator--v" />
				<span className="kt-subheader__desc"></span>
			</div>

			<div className="kt-subheader__toolbar">
				<div className="kt-subheader__wrapper">
          <Button
            className="btn kt-subheader__btn-primary btn-primary"
            type="button"
            onClick={openDialog}
          >
            New Manager
          </Button>          
				</div>
			</div>
      <ProfileManagerDialog open={show} handleClose={onClose}/>
		</>
	);
}
const SubHeaderProfileManagers = injectIntl(Sub);
export { ProfileManagers, SubHeaderProfileManagers };