import React, { Component, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import ListAltIcon from "@material-ui/icons/ListAlt";
import CircularProgress from "@material-ui/core/CircularProgress";
import FlagIcon from "@material-ui/icons/Flag";
import DisableIcon from "@material-ui/icons/Clear";
import ViewIcon from "@material-ui/icons/Visibility";
import RedoIcon from "@material-ui/icons/Redo";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $export,
  $restore,
  $disable
} from "../../../modules/subscription/customer";

const useStyles = makeStyles({
  table: {
    minWidth: 500
  },
  exportSpinner:{
    marginBottom:'-5px'
  }
});
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  {
    id: "first_name",
    numeric: false,
    disablePadding: false,
    label: "First Name"
  },
  {
    id: "last_name",
    numeric: false,
    disablePadding: false,
    label: "Last Name"
  },
  { id: "age", numeric: false, disablePadding: false, label: "Age" },
  { id: "country", numeric: false, disablePadding: false, label: "Country" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main() {
  const classes = useStyles();
  useEffect(() => {
    dispatch($fetchIndex())
  }, []);
  const customer = useSelector(({ customer }) => customer);
  const page=customer.meta.page-1;
  const customers= customer.data;
  const meta=customer.meta;
  const rowsPerPage = meta.pageSize;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    dispatch($page(newPage + 1));
  };
  const handleChangeRowsPerPage = event => {
    dispatch($pageSize(parseInt(event.target.value, 10)));
  };
  const actionDisable = id => event => {
    if (window.confirm("Are you sure to disable this item?"))  dispatch($disable(id));
  };
  const actionRestore = id => event => {
    dispatch($restore(id));
  };
  return (
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
                  <TableCell align="left">{row.first_name}</TableCell>
                  <TableCell align="left">{row.last_name}</TableCell>
                  <TableCell align="left">{row.age}</TableCell>
                  <TableCell align="left">{row.country}</TableCell>
                  <TableCell align="left">
                    <span
                      className={classnames(
                        " btn btn-bold btn-xs btn-font-sm normal",
                        {
                          "btn-label-success": row.status == "Active",
                          "btn-label-danger": row.status == "Inactive"
                        }
                      )}
                    >
                      {row.status}
                      {row.trial == 1 && <FlagIcon color="primary" />}
                    </span>
                  </TableCell>
                  <TableCell align="left" style={{ padding: "0" }}>
                    <NavLink
                        to={`/admin/customers/${row.id}`}
                        exact
                      >
                      <IconButton
                        className={classes.button}
                        aria-label="View"
                        title="View"
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </NavLink>  
                    {row.status == "Disabled" ? (
                      <>
                        <IconButton
                          color="secondary"
                          className={classes.button}
                          aria-label="Restore"
                          title="Restore"
                          onClick={actionRestore(row.id)}
                        >
                          <RedoIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          className={classes.button}
                          aria-label="Disable"
                          title="Disable"
                          onClick={actionDisable(row.id)}
                        >
                          <DisableIcon color="error" />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={INDEX_PAGE_SIZE_OPTIONS}
                colSpan={headRows.length}
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
  );
}
const Customers = injectIntl(Main);
function Sub() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCondition = useSelector(({ customer }) => customer.searchCondition);
  const exportLoading = useSelector(({ customer }) => customer.exportLoading);
  const handleChange = name => event => {
    dispatch($changeConditionValue(name, event.target.value));
  };
  const handleClick = () => {
    dispatch($export(searchCondition));
  };
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

        <h3 className="kt-subheader__title">Customers</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
          <TextField
            id="search"
            label="search"
            className={classes.textField}
            value={searchCondition.search}
            onChange={handleChange("search")}
          />
        </span>
        <span>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchCondition.status}
              onChange={handleChange("status")}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Leaving">Leaving</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Disabled">Disabled</MenuItem>
            </Select>
          </FormControl>
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          {exportLoading?(
            <CircularProgress size={18} className={classes.exportSpinner}/>
          ):(
            <IconButton
              className={classes.button}
              aria-label="Export"
              title="Export"
              onClick={handleClick}
            >
              <ListAltIcon color="primary" />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
}

const SubHeaderCustomers = injectIntl(Sub);
export { Customers, SubHeaderCustomers };
