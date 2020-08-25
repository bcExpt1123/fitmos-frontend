import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import { Paper, colors, Table, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination, IconButton } from '@material-ui/core';
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { NavLink } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from '@material-ui/icons/Pageview';
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants"; 
import {
  $fetchIndexActive,
  $page,
  $pageSize,
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
      color: colors.red[800]
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
  },[dispatch]);
  
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
                    <TableCell align="center">
                      <IconButton
                      title="View Report"
                      color='primary'>
                        <NavLink to={`/admin/survey/${row.id}/view`}>
                          <PageviewIcon color='primary'/>
                        </NavLink>
                      </IconButton>
                      <IconButton
                        title="Edit"
                        color="secondary"
                      >
                        <NavLink to={`/admin/survey/${row.id}`}>
                          <EditIcon />
                        </NavLink>
                      </IconButton>
                      <IconButton
                        className={classes.button}
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

