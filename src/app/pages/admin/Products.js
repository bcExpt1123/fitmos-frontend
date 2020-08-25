import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core';
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton }from "@material-ui/core";
import { NavLink } from "react-router-dom";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RedoIcon from "@material-ui/icons/Redo";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
    $pageSize,
    $page,
    $fetchIndexProducts,
    $disable,
    $restore,
    $delete,
  } from "../../../modules/subscription/product";
const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		marginTop:"15px",
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(3),
  },
  button: {
    width:"20px",
    height:"20px",
  },
  tablePaddingHead: {
    padding:"20px 10px"
  },
  tablePadding: {
    padding:"10px",
  }
}));
const Main = () =>{
	const classes = useStyles();
  const dispatch=useDispatch();
  const product = useSelector(({ product }) => product);
  console.log(product);
  const newproduct = product.item.companyMatchId;
  const products = product.data;
  const meta = product.meta;
  const page = product.meta.page - 1;
  const rowsPerPage = product.meta.pageSize;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
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
    if (window.confirm("Are you sure to delete this product?")) dispatch($delete(id));
  };
	const headRows = [
		{ id: "id", numeric: false, disablePadding: false, label: "ID",width:"auto" },
		{ id: "thumbnail", numeric: false, disablePadding: false, label: "Thumbnail" ,width:"auto"},
		{ id: "name", numeric: false, disablePadding: false, label: "Name" ,width:"auto"},
		{ id: "priceType", numeric: false, disablePadding: false, label: "PriceType" ,width:"auto"},
		{	id: "discount",numeric: false,disablePadding: false,label: "Discount",width:"auto"},
		{	id: "regularPrice",numeric: false,disablePadding: false,label: "Regular",width:"auto"},
		{	id: "price",numeric: false,disablePadding: false,label: "Price",width:"auto"},
		{ id: "voucher_type", numeric: false, disablePadding: false, label: "Voucher" ,width:"auto"},
		{ id: "expiration_date", numeric: false, disablePadding: false, label: "Expiration" ,width:"auto"},
		{ id: "status", numeric: false, disablePadding: false, label: "Status" ,width:"auto"},
		{ id: "action", numeric: false, disablePadding: false, label: "Actions" ,width:"100"}
	];
    return(
			<>
				<Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  {headRows.map(row => (
                    <TableCell
                      key={row.id}
                      align={"center"}
                      padding={row.disablePadding ? "none" : "default"}
                      sortDirection={false}
                      width={row.width}
                      className={classes.tablePaddingHead}
                    >
                      {row.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
              {products != null &&
                products.map(row => (
                  <TableRow key={row.id}>
                    <TableCell align="center" component="th" scope="row" className={classes.tablePadding}>
                      {row.id}
                    </TableCell>
                    <TableCell align="center" className={classes.tablePadding}>
                      <img alt="company" src={row.thumbnail} width="50px"/>
                    </TableCell>
                    <TableCell align="center" className={classes.tablePadding}>{row.name}</TableCell>
                    <TableCell align="center" className={classes.tablePadding}>{row.price_type}</TableCell>
                    {row.price_type==="offer"?(
                      <TableCell align="center" className={classes.tablePadding}>&nbsp;</TableCell>
                    ):(
                      <TableCell align="center" className={classes.tablePadding}>{row.discount}</TableCell>
                    )}
                    {row.price_type==="offer"?(
                      <TableCell align="center" className={classes.tablePadding}>{row.regular_price}</TableCell>
                      ):(
                        <TableCell align="center" className={classes.tablePadding}>&nbsp;</TableCell>
                    )}
                      {row.price_type==="offer"?(
                        <TableCell align="center" className={classes.tablePadding}>{row.price}</TableCell>
                        ):(
                        <TableCell align="center" className={classes.tablePadding}>&nbsp;</TableCell>
                    )}
                    <TableCell align="center" className={classes.tablePadding}>{row.voucher_type}</TableCell>
                    <TableCell align="center" className={classes.tablePadding}>{row.expiration_date}</TableCell>
                    <TableCell align="center" className={classes.tablePadding}>{row.status}</TableCell>
                    <TableCell align="center" className={classes.tablePadding}>
                      {row.status === "Active" ? (
                        <>
                          <IconButton
                            className={classes.button}
                            aria-label="Disable"
                            title="View Gallery"
                            // onClick={viewImagesAction(row.id)}
                          >
                            <NavLink to={`/admin/companies/${row.id}/products/viewImages/${row.id}`}>
                              <VisibilityIcon color="primary" />
                            </NavLink>
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Edit"
                            title="Edit"
                            id={`${row.id}`}
                            color="secondary"
                          >
                            <NavLink to={`/admin/companies/${newproduct}/products/${row.id}`}>
                              <EditIcon />
                            </NavLink>
                          </IconButton>
                          <IconButton
                            className={classes.button}
                            aria-label="Disable"
                            title="To Disable"
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
                            aria-label="Active"
                            title="To Active"
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
const Products = injectIntl(Main);
function Sub({match}) {
  const product = useSelector(({ product }) => product);
  const dispatch=useDispatch();
  useEffect(() => { if(match.params.id){ 
    dispatch($fetchIndexProducts(match.params.id)); }}, []);// eslint-disable-line react-hooks/exhaustive-deps
  const newproduct = product.item.companyMatchId;
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

        <h3 className="kt-subheader__title">Products</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={`/admin/companies/${newproduct}/products/create`}
          >
            <span className="MuiButton-label">Create Product&nbsp;</span>
          </NavLink>
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Create"
            title="Create"
            to={`/admin/companies`}
          >
            <span className="MuiButton-label">Back&nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const SubHeaderProducts = injectIntl(Sub);
export { Products, SubHeaderProducts };