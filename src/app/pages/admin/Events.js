import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles } from "@material-ui/core";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, TextField, colors }from "@material-ui/core";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
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
  $disable,
  $restore,
  $delete
} from "../../../modules/subscription/event";


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
  { id: "created_date", numeric: false, disablePadding: false, label: "Date" },
  { id: "Title", numeric: false, disablePadding: false, label: "Title" },
  { id: "category", numeric: false, disablePadding: false, label: "Category" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main() {
  const classes = useStyles();
  const dispatch=useDispatch();
  const event = useSelector(({ event }) => event);
  const events = event.data;
  const meta = event.meta;
  useEffect(() => {
    dispatch($fetchIndex())
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  const page = event.meta.page - 1;
  const rowsPerPage = event.meta.pageSize;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, event.meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    dispatch($page(newPage + 1));
  };

  const handleChangeRowsPerPage = event => {
    dispatch($pageSize(parseInt(event.target.value, 10)));
  };
  const actionDisable = id => event => {
    dispatch($disable(id));
  };
  const actionRestore = id => event => {
    dispatch($restore(id));
  };
  const actionDelete = id => event => {
    if (window.confirm("Are you sure to delete this item?")) dispatch($delete(id));
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
              {events != null &&
                events.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.created_date}</TableCell>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">
                      {row.category && row.category.name}
                    </TableCell>
                    <TableCell align="left">
                      <span
                        className={classnames(
                          " btn btn-bold btn-xs btn-font-sm normal",
                          {
                            "btn-label-success": row.status === "Publish",
                            "btn-label-brand": row.status === "Draft"
                          }
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      {row.status === "Publish" ? (
                        <>
                          <NavLink
                            className=""
                            aria-label="Event Edit"
                            title="Event Edit"
                            to={`/admin/events/${row.id}`}
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
                          <IconButton
                            className={classes.button}
                            aria-label="To Draft"
                            title="To Draft"
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
const Events = injectIntl(Main);
function Sub() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCondition = useSelector(({ event }) => event.searchCondition);
  const handleChange = name => event => {
    dispatch($changeConditionValue(name, event.target.value));
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

        <h3 className="kt-subheader__title">News & Events</h3>
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
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Categories"
            title="Manage Categories"
            to={"/admin/categories"}
          >
            <span className="MuiButton-label">Categories &nbsp;</span>
          </NavLink>
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={"/admin/events/create"}
          >
            <span className="MuiButton-label">Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const SubHeaderEvents = injectIntl(Sub);
export { Events, SubHeaderEvents };
