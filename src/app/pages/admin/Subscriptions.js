import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles } from "@material-ui/styles";
import { Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, 
  colors, TextField, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core";
import DisableIcon from "@material-ui/icons/Clear";
import ViewIcon from "@material-ui/icons/Visibility";
import RedoIcon from "@material-ui/icons/Redo";
import ListAltIcon from "@material-ui/icons/ListAlt";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $cancel,
  $restore,
  $export
} from "../../../modules/subscription/subscription";

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
  {
    id: "subscription_name",
    numeric: false,
    disablePadding: false,
    label: "Subscription"
  },
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "frequency",
    numeric: false,
    disablePadding: false,
    label: "Frequency"
  },
  {
    id: "total_paid",
    numeric: false,
    disablePadding: false,
    label: "Total Paid"
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main({ subscriptions, meta, $page, $pageSize, $cancel, $restore }) {
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
  const actionCancel = id => event => {
    $cancel(id);
  };
  const actionRestore = id => event => {
    $restore(id);
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
              {subscriptions != null &&
                subscriptions.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.subscription_name}</TableCell>
                    <TableCell align="left">{row.customer_name}</TableCell>
                    <TableCell align="left">{row.frequency}</TableCell>
                    <TableCell align="left">{row.total_paid}</TableCell>
                    <TableCell align="left">
                      <span
                        className={classnames(
                          " btn btn-bold btn-xs btn-font-sm normal",
                          {
                            "btn-label-success": row.status === "Active",
                            "btn-label-info": row.status === "LEAVING"
                          }
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      <NavLink to={`/admin/subscriptions/${row.id}`}>
                        <IconButton
                          className={classes.button}
                          aria-label="View"
                          title="View"
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </NavLink>  
                      {row.status === "Active" ? (
                        <>
                          <IconButton
                            className={classes.button}
                            aria-label="Cancel"
                            title="Cancel"
                            onClick={actionCancel(row.id)}
                          >
                            <DisableIcon color="error" />
                          </IconButton>
                        </>
                      ) : (
                          <>
                            <IconButton
                              color="secondary"
                              className={classes.button}
                              aria-label="Restore into Active"
                              title="Restore into Active"
                              onClick={actionRestore(row.id)}
                            >
                              <RedoIcon />
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
  subscriptions: state.subscription.data,
  meta: state.subscription.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize,
  $cancel,
  $restore
};
const SubscriptionConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class SubscriptionWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
  }
  render() {
    return (
      <>
        <SubscriptionConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex
};

const Subscriptions = injectIntl(
  connect(null, mapDispatchToProps1)(SubscriptionWrapper)
);
function Sub({ searchCondition, $changeConditionValue }) {
  const classes = useStyles();
  const handleChange = name => event => {
    $changeConditionValue(name, event.target.value);
  };
  const handleClick = () => {
    $export(searchCondition);
    //console.log('clicked')
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

        <h3 className="kt-subheader__title">Subscriptions</h3>
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
        <span></span>
        <span>
          <TextField
            id="from_date"
            label="From"
            className={classes.textField}
            type="date"
            value={searchCondition.from}
            onChange={handleChange("from")}
            InputLabelProps={{
              shrink: true
            }}
          />
        </span>
        <span>
          <TextField
            id="to_date"
            label="To"
            className={classes.textField}
            type="date"
            value={searchCondition.to}
            onChange={handleChange("to")}
            InputLabelProps={{
              shrink: true
            }}
          />
        </span>
        <span>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Plan</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchCondition.plan_id}
              onChange={handleChange("plan_id")}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="1">Free</MenuItem>
              <MenuItem value="2">Paid</MenuItem>
            </Select>
          </FormControl>
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
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Leaving">Leaving</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
            </Select>
          </FormControl>
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <IconButton
            className={classes.button}
            aria-label="Export"
            title="Export"
            onClick={handleClick}
          >
            <ListAltIcon color="primary" />
          </IconButton>
        </div>
      </div>
    </>
  );
}
const mapStateToPropsSub = state => ({
  searchCondition: state.subscription.searchCondition
});
const mapDispatchToPropsSub = {
  $changeConditionValue
};
const SubHeaderSubscriptions = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { Subscriptions, SubHeaderSubscriptions };
