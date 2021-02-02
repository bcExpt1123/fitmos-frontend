import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, TextField, MenuItem, FormControl, InputLabel, Select, colors }from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RedoIcon from "@material-ui/icons/Redo";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $disable,
  $restore,
  $delete
} from "../../../modules/subscription/coupon";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 500
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
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  { id: "code", numeric: false, disablePadding: false, label: "Code" },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Creation"
  },
  {
    id: "non_active",
    numeric: false,
    disablePadding: false,
    label: "Non Active"
  },
  { id: "active", numeric: false, disablePadding: false, label: "Active" },
  {
    id: "current_month",
    numeric: false,
    disablePadding: false,
    label: "New this month"
  },
  { id: "paid", numeric: false, disablePadding: false, label: "Paid" },
  { id: "discount", numeric: false, disablePadding: false, label: "Discount" },
  { id: "renewal", numeric: false, disablePadding: false, label: "Renewals" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main({
  coupons,
  meta,
  $page,
  $pageSize,
  $disable,
  $restore,
  $delete
}) {
  const classes = useStyles();
  const page = meta.page - 1;
  const rowsPerPage = meta.pageSize;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    $page(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    $pageSize(parseInt(event.target.value, 10));
  };
  const actionDisable = id => event => {
    $disable(id);
  };
  const actionRestore = id => event => {
    $restore(id);
  };
  const actionDelete = id => event => {
    if (window.confirm("Are you sure to delete this item?")) $delete(id);
  };
  return (
    <>
      <Paper className={classes.root}>
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
                  >
                    {row.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons != null &&
                coupons.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.code}</TableCell>
                    <TableCell align="left">
                      {row.name}
                      <br />
                      {row.mail}
                    </TableCell>
                    <TableCell align="left">{row.created_date}</TableCell>
                    <TableCell align="left">{row.non_active}</TableCell>
                    <TableCell align="left">{row.active}</TableCell>
                    <TableCell align="left">{row.current_month}</TableCell>
                    <TableCell align="left">{row.paid}</TableCell>
                    <TableCell align="left">{row.discount}{row.form}</TableCell>
                    <TableCell align="left">
                      {(row.renewal === 1 || row.renewal === '1') ? <>yes</> : <>no</>}
                    </TableCell>
                    <TableCell align="left">
                      <span
                        className={classnames(
                          " btn btn-bold btn-xs btn-font-sm normal",
                          {
                            "btn-label-success": row.status === "Active",
                            "btn-label-danger": row.status === "Disabled"
                          }
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      {row.status === "Active" ? (
                        <>
                          <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            title="Edit"
                            color="secondary"
                          >
                            <NavLink to={`/admin/coupons/${row.id}`}>
                              <EditIcon />
                            </NavLink>
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Disable"
                            title="Disable"
                            onClick={actionDisable(row.id)}
                          >
                            <DisableIcon color="error" />
                          </IconButton>
                        </>
                      ) : (
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
                          <IconButton
                            className={classes.button}
                            aria-label="Restore"
                            title="Delete"
                            onClick={actionDelete(row.id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </>
                      )}
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
    </>
  );
}
const mapStateToProps = state => ({
  coupons: state.coupon.data,
  meta: state.coupon.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize,
  $disable,
  $restore,
  $delete
};
const CouponConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class CouponWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
  }
  render() {
    return (
      <>
        <CouponConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex
};

const Coupons = injectIntl(connect(null, mapDispatchToProps1)(CouponWrapper));
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

        <h3 className="kt-subheader__title">Coupons</h3>
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
              <MenuItem value="Disabled">Disabled</MenuItem>
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
            to={"/admin/coupons/create"}
          >
            <span className="MuiButton-label">Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const mapStateToPropsSub = state => ({
  searchCondition: state.coupon.searchCondition
});
const mapDispatchToPropsSub = {
  $changeConditionValue
};
const SubHeaderCoupons = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { Coupons, SubHeaderCoupons };
