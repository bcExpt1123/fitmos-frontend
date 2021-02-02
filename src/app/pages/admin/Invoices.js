import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles } from "@material-ui/core";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, TextField, colors }from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $export
} from "../../../modules/subscription/invoice";

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
  { id: "id", numeric: false, disablePadding: false, label: "Invoice" },
  {
    id: "customer",
    numeric: false,
    disablePadding: false,
    label: "Customer Name"
  },
  { id: "service", numeric: false, disablePadding: false, label: "Plan" },
  { id: "paid_date", numeric: false, disablePadding: false, label: "Date" },
  { id: "total", numeric: false, disablePadding: false, label: "Total" },
  { id: "time", numeric: false, disablePadding: false, label: "Time" },
  { id: "payment", numeric: false, disablePadding: false, label: "Payment" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main({ invoices, meta, $page, $pageSize }) {
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
              {invoices != null &&
                invoices.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.customer_name}</TableCell>
                    <TableCell align="left">
                      {row.transaction.plan.service.title}
                    </TableCell>
                    <TableCell align="left">{row.paid_date}</TableCell>
                    <TableCell align="left">{row.transaction.total}</TableCell>
                    <TableCell align="left">{row.time}</TableCell>
                    <TableCell align="left">
                      {row.transaction.type === 0 && "Credit Card"}
                      {row.transaction.type === 1 && "Paypal"}
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      <NavLink to={`/admin/invoices/${row.id}`}>
                        <IconButton
                          className={classes.button}
                          aria-label="Print"
                          title="Print"
                        >
                          <PrintIcon color="primary" />
                        </IconButton>
                      </NavLink>
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
  invoices: state.invoice.data,
  meta: state.invoice.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize
};
const InvoiceConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class InvoiceWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
    this.props.$changeConditionValue("customer_id", "");
  }
  render() {
    return (
      <>
        <InvoiceConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex,
  $changeConditionValue
};

const Invoices = injectIntl(connect(null, mapDispatchToProps1)(InvoiceWrapper));
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

        <h3 className="kt-subheader__title">Invoices</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
          <TextField
            id="name"
            label="search"
            className={classes.textField}
            value={searchCondition.name}
            onChange={handleChange("name")}
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
  searchCondition: state.invoice.searchCondition
});
const mapDispatchToPropsSub = {
  $changeConditionValue
};
const SubHeaderInvoices = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { Invoices, SubHeaderInvoices };
