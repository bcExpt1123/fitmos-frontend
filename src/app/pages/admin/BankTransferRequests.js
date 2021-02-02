import React, { Component,useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {  injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, 
  colors, TextField, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core";
import DisableIcon from "@material-ui/icons/Clear";
import CheckIcon from "@material-ui/icons/Check";
import RedoIcon from "@material-ui/icons/Redo";
import classnames from "classnames";

import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $export,
  $approve,
  $reject,
  $restore
} from "../../../modules/subscription/bankTransferRequest";

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
  { id: "customer", numeric: false, disablePadding: false, label: "Customer" },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "BankTransferRequest Date"
  },
  {
    id: "frequency",
    numeric: false,
    disablePadding: false,
    label: "Plan"
  },
  { id: "total", numeric: false, disablePadding: false, label: "Total" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main({ bankTransferRequests, meta, $page, $pageSize }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const page = meta.page - 1;
  const rowsPerPage = meta.pageSize;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    $page(newPage + 1);
  };
  const logContent = useSelector(({ bankTransferRequest }) => bankTransferRequest.log);
  const handleChangeRowsPerPage = event => {
    $pageSize(parseInt(event.target.value, 10));
  };
  const actionApprove = id => event => {
    if (window.confirm("Are you sure to approve this bank transfer request?")) dispatch($approve(id));
  };
  const actionReject = id => event => {
    if (window.confirm("Are you sure to reject this bank transfer request?")) dispatch($reject(id));
  };  
  const actionRestore = id => event => {
    if (window.confirm("Are you sure to restore this bank transfer request?")) dispatch($restore(id));
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
              {bankTransferRequests !== null &&
                bankTransferRequests.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.customer_name}</TableCell>
                    <TableCell align="left">{row.created_at}</TableCell>
                    <TableCell align="left">{row.frequency}</TableCell>
                    <TableCell align="left">{row.total}</TableCell>
                    <TableCell align="left">
                      <span
                        className={classnames(
                          " btn btn-bold btn-xs btn-font-sm normal",
                          {
                            "btn-label-success": row.status === "Completed",
                            "btn-label-danger": row.status === "Declined",
                            "btn-label-brand": row.status === "Pending"
                          }
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      {row.status === "Pending" ? (
                        <>
                          <IconButton
                            className={classes.button}
                            aria-label="Approve"
                            title="Approve"
                            color="secondary"
                            onClick={actionApprove(row.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Reject"
                            title="Reject"
                            onClick={actionReject(row.id)}
                          >
                            <DisableIcon color="error" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="secondary"
                            className={classes.button}
                            aria-label="Publish"
                            title="To Publish"
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
  bankTransferRequests: state.bankTransferRequest.data,
  meta: state.bankTransferRequest.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize
};
const BankTransferRequestConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class BankTransferRequestWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
    this.props.$changeConditionValue("customer_id", "");
  }
  render() {
    return (
      <>
        <BankTransferRequestConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex,
  $changeConditionValue
};

const BankTransferRequests = injectIntl(
  connect(null, mapDispatchToProps1)(BankTransferRequestWrapper)
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

        <h3 className="kt-subheader__title">BankTransferRequests</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
          <TextField
            id="customer_name"
            label="customer name"
            className={classes.textField}
            value={searchCondition.customer_name}
            onChange={handleChange("customer_name")}
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
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchCondition.status}
              onChange={handleChange("status")}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Declined">Declined</MenuItem>
            </Select>
          </FormControl>
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          {/* <IconButton
            className={classes.button}
            aria-label="Export"
            title="Export"
            onClick={handleClick}
          >
            <ListAltIcon color="primary" />
          </IconButton> */}
        </div>
      </div>
    </>
  );
}
const mapStateToPropsSub = state => ({
  searchCondition: state.bankTransferRequest.searchCondition
});
const mapDispatchToPropsSub = {
  $changeConditionValue
};
const SubHeaderBankTransferRequests = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { BankTransferRequests, SubHeaderBankTransferRequests };
