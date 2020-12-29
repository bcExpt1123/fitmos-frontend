import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, TextField }from "@material-ui/core";
import { NavLink } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import {
  $fetchIndex,$page,$pageSize,$delete,$changeConditionValue
} from "../../../modules/subscription/category";

const useStyles = makeStyles(theme => ({
}));
const headRows = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];

function Categories() {
  const classes = useStyles();
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch($fetchIndex())
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const category = useSelector(({ category }) => category);
  const page = category.meta.page - 1;
  const rowsPerPage = category.meta.pageSize;
  const categories = category.data;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, category.meta.total - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    dispatch($page(newPage + 1));
  };

  const handleChangeRowsPerPage = event => {
    dispatch($pageSize(parseInt(event.target.value, 10)));
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
              {categories != null &&
                categories.map(row => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left" style={{ padding: "0" }}>
                      <NavLink
                        className=""
                        aria-label="Category Edit"
                        title="Category Edit"
                        to={`/admin/categories/${row.id}`}
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
                        aria-label="Delete"
                        title="Delete"
                        onClick={actionDelete(row.id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
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
                  count={category.meta.total}
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
function SubHeaderCategories() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCondition = useSelector(({ category }) => category.searchCondition);
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
        <h3 className="kt-subheader__title">
          Categoires
        </h3>
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
            aria-label="Events"
            title="Events"
            to={"/admin/events"}
          >
            <span className="MuiButton-label">Events &nbsp;</span>
          </NavLink>
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={"/admin/categories/create"}
          >
            <span className="MuiButton-label">Category Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
export { Categories, SubHeaderCategories };
