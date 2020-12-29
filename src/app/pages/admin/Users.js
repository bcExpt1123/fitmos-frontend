import React, { Component } from "react";
import { connect, useDispatch } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles } from "@material-ui/styles";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, FormControl,MenuItem,
  IconButton, TextField, InputLabel, Select } from "@material-ui/core";
import DisableIcon from "@material-ui/icons/Clear";
import EditIcon from "@material-ui/icons/Edit";
import RedoIcon from "@material-ui/icons/Redo";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $restore,
  $disable
} from "../../../modules/subscription/admin";

const useStyles = makeStyles({
  table: {
    minWidth: 500
  }
});
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  { id: "name",numeric: false, disablePadding: false, label: "Name"},
  { id: "email",numeric: false, disablePadding: false, label: "Email"},
  { id: "role", numeric: false, disablePadding: false, label: "Role" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main({ admins, meta, $page, $pageSize }) {
  const classes = useStyles();
  const page = meta.page - 1;
  const rowsPerPage = meta.pageSize;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    $page(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    $pageSize(parseInt(event.target.value, 10));
  };
  const actionDisable = id => event => {
    dispatch($disable(id));
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
            {admins != null &&
              admins.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.role}</TableCell>
                  <TableCell align="left">
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
                  </TableCell>
                  <TableCell align="left" style={{ padding: "0" }}>
                    {!row.me&&(
                      <>
                        <NavLink
                          to={`/admin/users/${row.id}`}
                          exact
                        >
                        <IconButton
                          className={classes.button}
                          aria-label="Edit"
                          title="Edit"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </NavLink>  
                      {row.status === "Inactive" ? (
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
const mapStateToProps = state => ({
  admins: state.admin.data,
  meta: state.admin.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize,
  $disable,
  $restore
};
const UsersConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class UsersWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
  }
  render() {
    return (
      <>
        <UsersConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex
};

const Users = injectIntl(
  connect(null, mapDispatchToProps1)(UsersWrapper)
);
function Sub({ searchCondition, $changeConditionValue }) {
  const classes = useStyles();
  const handleChange = name => event => {
    $changeConditionValue(name, event.target.value);
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

        <h3 className="kt-subheader__title">Admin Users</h3>
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
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={"/admin/users/create"}
          >
            <span className="MuiButton-label">Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const mapStateToPropsSub = state => ({
  searchCondition: state.admin.searchCondition
});
const mapDispatchToPropsSub = {
  $changeConditionValue
};
const SubHeaderUsers = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { Users, SubHeaderUsers };
