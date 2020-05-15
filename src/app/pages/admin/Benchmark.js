import React, { Component } from "react";
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
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RedoIcon from "@material-ui/icons/Redo";
import { red } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
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
} from "../../../modules/subscription/benchmark";

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
  { id: "id", numeric: false, disablePadding: false, label: "ID",width:"auto" },
  { id: "Title", numeric: false, disablePadding: false, label: "Title" ,width:"auto"},
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",width:"auto"
  },
  { id: "time", numeric: false, disablePadding: false, label: "Time" ,width:"auto"},
  { id: "status", numeric: false, disablePadding: false, label: "Status" ,width:"150"},
  { id: "action", numeric: false, disablePadding: false, label: "Actions" ,width:"100"}
];
function Main({
  benchmarks,
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
  const handleChangePage = (benchmark, newPage) => {
    $page(newPage + 1);
  };

  const handleChangeRowsPerPage = benchmark => {
    $pageSize(parseInt(benchmark.target.value, 10));
  };
  const actionDisable = id => benchmark => {
    $disable(id);
  };
  const actionRestore = id => benchmark => {
    $restore(id);
  };
  const actionDelete = id => benchmark => {
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
                    width={row.width}
                  >
                    {row.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {benchmarks != null &&
                benchmarks.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">{row.time}</TableCell>
                    <TableCell align="left" width="100">
                      <span
                        className={classnames(
                          " btn btn-bold btn-xs btn-font-sm normal",
                          {
                            "btn-label-success": row.status == "Publish",
                            "btn-label-brand": row.status == "Draft"
                          }
                        )}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      {row.status == "Publish" ? (
                        <>
                          <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            title="Edit"
                            color="secondary"
                          >
                            <NavLink to={`/admin/benchmarks/${row.id}`}>
                              <EditIcon />
                            </NavLink>
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Disable"
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
                            aria-label="Publish"
                            title="To Publish"
                            onClick={actionRestore(row.id)}
                          >
                            <RedoIcon />
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Delete"
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
  benchmarks: state.benchmark.data,
  meta: state.benchmark.meta
});
const mapDispatchToProps = {
  $page,
  $pageSize,
  $disable,
  $restore,
  $delete
};
const BenchmarkConnct = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);
class BenchmarkWrapper extends Component {
  componentDidMount() {
    this.props.$fetchIndex();
  }
  render() {
    return (
      <>
        <BenchmarkConnct />
      </>
    );
  }
}
const mapDispatchToProps1 = {
  $fetchIndex
};

const Benchmarks = injectIntl(
  connect(null, mapDispatchToProps1)(BenchmarkWrapper)
);
function Sub({ searchCondition, $changeConditionValue }) {
  const classes = useStyles();
  const handleChange = name => benchmark => {
    $changeConditionValue(name, benchmark.target.value);
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

        <h3 className="kt-subheader__title">Benchmarks</h3>
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
            aria-label="Create"
            title="Create"
            to={"/admin/benchmarks/create"}
          >
            <span className="MuiButton-label">Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const mapStateToPropsSub = state => ({
  searchCondition: state.benchmark.searchCondition
});
const mapDispatchToPropsSub = {
  $changeConditionValue
};
const SubHeaderBenchmarks = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { Benchmarks, SubHeaderBenchmarks };
