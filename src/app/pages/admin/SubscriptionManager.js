import React, { Component } from "react";
import { connect, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles } from "@material-ui/core";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, colors }from "@material-ui/core";
import DisableIcon from "@material-ui/icons/Clear";
import BookIcon from "@material-ui/icons/Book";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EditIcon from "@material-ui/icons/Edit";
import RedoIcon from "@material-ui/icons/Redo";
import { NavLink } from "react-router-dom";
import classnames from "classnames";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex
} from "../../../modules/subscription/service";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 500
  },
  icon: {
    margin: theme.spacing(2)
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
  { id: "title", numeric: false, disablePadding: false, label: "Name" },
  { id: "monthly", numeric: false, disablePadding: false, label: "Monthly" },
  {
    id: "quarterly",
    numeric: false,
    disablePadding: false,
    label: "Quarterly"
  },
  {
    id: "semiannual",
    numeric: false,
    disablePadding: false,
    label: "Semiannual"
  },
  { id: "yearly", numeric: false, disablePadding: false, label: "Yearly" },
  {
    id: "suscribers",
    numeric: false,
    disablePadding: false,
    label: "Suscribers"
  },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function SubscriptionManager({ services, meta, $page, $pageSize }) {
  const classes = useStyles();
  const page = meta.page - 1;
  const rowsPerPage = meta.pageSize;
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    $page(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    $pageSize(parseInt(event.target.value, 10));
  };
  const can = permission=>{
    if(currentUser.type==='admin'&&currentUser.role!=='super'){
      return currentUser.permissions.indexOf(permission)>-1;
    }
    else if(currentUser.type==='admin'&&currentUser.role==='super'){
      return true;
    }
  }
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
              {services != null &&
                services.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">{row.monthly}</TableCell>
                    <TableCell align="left">{row.quarterly}</TableCell>
                    <TableCell align="left">{row.semiannual}</TableCell>
                    <TableCell align="left">{row.yearly}</TableCell>
                    <TableCell align="left">{row.suscribers}</TableCell>
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
                    <TableCell align="left">
                      {can("subscription workout content")&&
                        <>
                          <NavLink
                            to={`/admin/subscription-cms/${row.id}`}
                            exact
                          >
                            <IconButton
                              className={classes.button}
                              aria-label="To Subscription CMS"
                              title="To Subscription CMS"
                              color="primary"
                            >
                              <BookIcon />
                            </IconButton>
                          </NavLink>
                          <NavLink
                            to={`/admin/subscription-pending/${row.id}`}
                            exact
                          >
                            <IconButton
                              className={classes.button}
                              aria-label="To Subscription Pending"
                              title="To Subscription Pending"
                              color="primary"
                            >
                              <AssignmentIcon />
                            </IconButton>
                          </NavLink>
                        </>  
                      }
                      {can("subscription pricing")&&
                        <NavLink
                          to={`/admin/subscription-manager/${row.id}`}
                          exact
                        >
                          <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            title="Edit"
                            color="secondary"
                          >
                            <EditIcon />
                          </IconButton>
                        </NavLink>
                      }
                      {false&&(<>
                        {row.status === "Active" ? (
                          <IconButton
                            className={classes.button}
                            aria-label="Disable"
                            title="Disable"
                          >
                            <DisableIcon color="error" />
                          </IconButton>
                        ) : (
                          <IconButton
                            color="secondary"
                            className={classes.button}
                            aria-label="Restore"
                            title="Disable"
                          >
                            <RedoIcon />
                          </IconButton>
                        )
                      }
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
  services: state.service.data,
  meta: state.service.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize
};
const SubscriptionManagerConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(SubscriptionManager)
);
class SubscriptionManagerWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
  }
  render() {
    return (
      <>
        <SubscriptionManagerConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex
};

export default injectIntl(
  connect(null, mapDispatchToProps1)(SubscriptionManagerWrapper)
);
export function SubHeaderSubscriptionManager() {
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

        <h3 className="kt-subheader__title">SubscriptionManager</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper"></div>
      </div>
    </>
  );
}
