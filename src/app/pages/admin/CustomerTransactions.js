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
import SearchIcon from "@material-ui/icons/Search";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { red } from "@material-ui/core/colors";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $export
} from "../../../modules/subscription/transaction";

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
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "CustomerTransaction Type"
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "CustomerTransaction Date"
  },
  { id: "total", numeric: false, disablePadding: false, label: "Total" },
  {
    id: "invoice",
    numeric: false,
    disablePadding: false,
    label: "Invoice No."
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  //{ id: "action", numeric: false, disablePadding: false, label: "Log" }
];
function Main({ transactions, meta, $page, $pageSize }) {
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
              {transactions != null &&
                transactions.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.content}</TableCell>
                    <TableCell align="left">{row.created_at}</TableCell>
                    <TableCell align="left">{row.total}</TableCell>
                    <TableCell align="left">{row.invoice_id}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    {false&&(
                      <TableCell align="left" style={{ padding: "0" }}>
                        {row.status != "Completed" && (
                          <IconButton
                            className={classes.button}
                            aria-label="Log"
                            title="Log"
                          >
                            <SearchIcon color="error" />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
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
  transactions: state.transaction.data,
  meta: state.transaction.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize
};
const CustomerTransactionConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class CustomerTransactionWrapper extends Component {
  render() {
    return (
      <>
        <CustomerTransactionConnct />
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

const CustomerTransactions = injectIntl(
  connect(mapStateToProps1, mapDispatchToProps1)(CustomerTransactionWrapper)
);
export { CustomerTransactions };
