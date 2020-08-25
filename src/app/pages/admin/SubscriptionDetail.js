import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, Grid }from "@material-ui/core";
import {
  $show
} from "../../../modules/subscription/subscription";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $changeConditionValue,
} from "../../../modules/subscription/transaction";


const useStyles = makeStyles(theme => ({
}));
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Transaction Type"
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Transaction Date"
  },
  { id: "total", numeric: false, disablePadding: false, label: "Total" },
  {
    id: "frequency",
    numeric: false,
    disablePadding: false,
    label: "Subscription Time"
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "comment", numeric: false, disablePadding: false, label: "Comment" }
];
function SubscriptionDetail() {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($show(id));
    dispatch($changeConditionValue("subscription_id", id));
  }, [id]);// eslint-disable-line react-hooks/exhaustive-deps
  const subscription = useSelector(({ subscription }) => subscription.item);
  const transaction = useSelector(({ transaction }) => transaction);
  const meta = transaction.meta;
  const page = meta.page - 1;
  const rowsPerPage = meta.pageSize;
  const transactions = transaction.data;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    $page(newPage + 1);
  };
  const handleChangeRowsPerPage = event => {
    $pageSize(parseInt(event.target.value, 10));
  };
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {subscription ? (
        <div className="subscription-detail">
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">Coupon</label>
              {subscription.customer.first_name + ' ' + subscription.customer.last_name}
            </Grid>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">Email</label>
              {subscription.customer.email}
            </Grid>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">WhatsApp</label>
              {subscription.customer.whatsapp_phone_number}
            </Grid>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">Country</label>
              {subscription.customer.country}
            </Grid>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">Start Date</label>
              {subscription.startDate}
            </Grid>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">End Date</label>
              {subscription.endDate}
            </Grid>
            <Grid item xs={3}>
              <label className="font-weight-bold d-block">Frequency</label>
              {subscription.frequency}
            </Grid>
            {subscription.cancelled_date && (
              <Grid item xs={3}>
                <label className="font-weight-bold d-block">Cancelled on</label>
                {subscription.cancelledDate}
              </Grid>
            )}
            {subscription.cancelled_reason && (
              <Grid item xs={6}>
                <label className="font-weight-bold d-block">Cancelled Reason</label>
                {subscription.cancelled_reason}
              </Grid>
            )}
          </Grid>
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
                      <TableCell align="left">{row.type===1?('PayPal'):('Nmi Credit Card')}</TableCell>
                      <TableCell align="left">{row.created_at}</TableCell>
                      <TableCell align="left">{row.total}</TableCell>
                      <TableCell align="left">{row.frequency}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left" style={{ padding: "0" }}>
                        {row.content}
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

        </div>
      ) : (
          <div>
            No Subscription
        </div>
        )
      }
    </Paper>
  );
}
function SubHeaderSubscriptionDetail() {
  const subscription = useSelector(({ subscription }) => subscription.item);
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
        {subscription ? (
          <h3 className="kt-subheader__title">
            {subscription.serviceName} | {subscription.customer.first_name + ' ' + subscription.customer.last_name}
          </h3>
        ) : (
            <h3 className="kt-subheader__title">No Subscription</h3>
          )}
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <button className="btn btn-primary">
            {subscription && subscription.status}
          </button>
        </div>
      </div>
    </>
  );
}
export { SubscriptionDetail, SubHeaderSubscriptionDetail };
