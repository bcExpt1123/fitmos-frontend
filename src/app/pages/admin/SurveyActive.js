import React, { Component,useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {spacing} from '@material-ui/system';
import Box from '@material-ui/core/Box';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TextField from '@material-ui/core/TextField';
import { red } from "@material-ui/core/colors";      
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";    
import TableRow from "@material-ui/core/TableRow";
import { NavLink } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CustomerOverview from "./CustomerOverview";
import { CustomerTransactions } from "./CustomerTransactions";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants"; 
import {
  $fetchIndexActive,
  $page,
  $pageSize,
  $changeConditionValue,
  $deleteActive
} from "../../../modules/subscription/survey";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign:'center',
    color:theme.palette.text.secondary,
	},
	table: {
		minWidth: 500,
		cursor:'pointer'
  },
  icon: {
    margin: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  iconHover: {
    margin: theme.spacing(2),
    "&:hover": {
      color: red[800]
    }
  }
}));
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID",width:"auto" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" ,width:"auto"},
  { id: "start", numeric: false, disablePadding: false, label: "Start" ,width:"auto"},
  { id: "end", numeric: false, disablePadding: false, label: "End" ,width:"auto"},
  { id: "action", numeric: false, disablePadding: false, label: "Actions" ,width:"auto"}
];
const Main = () =>{
  const classes=useStyles();
  const dispatch=useDispatch();
  const survey = useSelector(({ survey }) => survey);
  useEffect(() => {
    dispatch($fetchIndexActive())
  }, []);
  
  const surveyData = survey.data_active;
  const meta = survey.meta;
  const page = survey.meta.page - 1;
  const rowsPerPage = survey.meta.pageSize;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    dispatch($page(newPage + 1));
  };
  const handleChangeRowsPerPage = event => {
    dispatch($pageSize(parseInt(event.target.value, 10)));
  };
  const actionDelete = id => event => {
    if (window.confirm("Are you sure to delete this item?")) dispatch($deleteActive(id));
  };
  return(
		<>
			<Paper>
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-label="custom pagination table">
						<TableHead>
							<TableRow>
								{headRows.map(row => (
									<TableCell
										key={row.id}
										align={"left"}
										padding={row.disablePadding ? "none" : "default"}
										sortDirection={false}
										width={row.width}
										align="center"
									>
										{row.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
            {surveyData != null &&
                surveyData.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" align="center" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.title}</TableCell>
                    <TableCell align="center">{row.from_date}</TableCell>
                    <TableCell align="center">{row.to_date}</TableCell>
                    <TableCell align="center" style={{ padding: "0" }}>
                          <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            title="Edit"
                            color="secondary"
                          >
                            <NavLink to={`/admin/survey/${row.id}`}>
                              <EditIcon />
                            </NavLink>
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Disable"
                            title="Delete"
                            onClick={actionDelete(row.id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 43 * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
						</TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={INDEX_PAGE_SIZE_OPTIONS}
                  colSpan={3}
                  count={meta.total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
					</Table>
				</div>
			</Paper>
		</>
  );
};
const SurveyActive = injectIntl(Main);
export { SurveyActive};

