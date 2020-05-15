import React, { Component,useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
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
import PrintIcon from "@material-ui/icons/Print";
import { red } from "@material-ui/core/colors";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $changeConditionValue,
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
      color: red[800]
    }
  }
}));
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "Invoice No" },
  { id: "service", numeric: false, disablePadding: false, label: "Plan" },
  { id: "paid_date", numeric: false, disablePadding: false, label: "Date" },
  { id: "total", numeric: false, disablePadding: false, label: "Total" },
  { id: "time", numeric: false, disablePadding: false, label: "Time" },
  { id: "payment", numeric: false, disablePadding: false, label: "Payment" },
  { id: "action", numeric: false, disablePadding: false, label: "Imprimir" }
];
function Main({ invoices, meta, $page, $pageSize }) {
  const customer = useSelector(({ customer }) => customer.item);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($changeConditionValue("customer_id", customer.id));
  },[customer]);
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
                    <TableCell align="left">
                      {row.transaction.plan.service.title}
                    </TableCell>
                    <TableCell align="left">{row.paid_date}</TableCell>
                    <TableCell align="left">{row.transaction.total}</TableCell>
                    <TableCell align="left">{row.time}</TableCell>
                    <TableCell align="left">
                      {row.transaction.type == 0 && "Credit Card"}
                      {row.transaction.type == 1 && "Paypal"}
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
  render() {
    return (
      <>
        <InvoiceConnct />
      </>
    );
  }
}
const mapStateToProps1 = state => ({
  item: state.customer.item
});
const mapDispatchToProps1 = {
  $changeConditionValue
};

const CustomerInvoices = injectIntl(
  connect(mapStateToProps1, mapDispatchToProps1)(InvoiceWrapper)
);
export { CustomerInvoices };
