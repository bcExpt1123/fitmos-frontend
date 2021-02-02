import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core';
import { Paper, TextField, TablePagination, Table, TableHead, TableBody, TableCell, TableFooter, TableRow, IconButton} from '@material-ui/core';
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { NavLink } from "react-router-dom";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PageviewIcon from "@material-ui/icons/Pageview";
import RedoIcon from "@material-ui/icons/Redo";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
    $pageSize,
    $page,
    $fetchIndexCompanies,
    $changeConditionValue,
    $disable,
    $restore,
    $delete,
    $productId,
    $showCompanyDetail,
  } from "../../../modules/subscription/company";
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
  }
}));
const Main = () =>{
	const classes = useStyles();
  const dispatch=useDispatch();
  useEffect(() => {
    dispatch($fetchIndexCompanies())
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const company = useSelector(({ company }) => company);
  const companies = company.data;
  console.log(company);
  const meta = company.meta;
  const page = company.meta.page - 1;
  const rowsPerPage = company.meta.pageSize;
  const handleChangePage = (event, newPage) => {
    dispatch($page(newPage + 1));
  };

  const handleChangeRowsPerPage = event => {
    dispatch($pageSize(parseInt(event.target.value, 10)));
  };
  const actionDisable = id => event => {
    console.log(1111);
    dispatch($disable(id));
  };
  const actionRestore = id => event => {
    dispatch($restore(id));
  };
  const actionDelete = id => event => {
    console.log(333);
    if (window.confirm("Are you sure to delete this item?")) dispatch($delete(id));
  };
  const fetchProductId = id =>event =>{
    dispatch($productId(id));
  }
  const showCompanyDetail = id =>event =>{
    dispatch($showCompanyDetail(id));
  }
	const headRows = [
		{ id: "id", numeric: false, disablePadding: false, label: "ID",width:"auto" },
		{ id: "logo", numeric: false, disablePadding: false, label: "Logo" ,width:"auto"},
		{ id: "company", numeric: false, disablePadding: false, label: "Company" ,width:"auto"},
		{	id: "description",numeric: false,disablePadding: false,label: "Description",width:"auto"},
		{	id: "phone",numeric: false,disablePadding: false,label: "Phone",width:"auto"},
		{	id: "mail",numeric: false,disablePadding: false,label: "Mail",width:"auto"},
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
                  >
                    {row.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {companies != null &&
                  companies.map(row => ( 
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">
                      <img alt="company" src={row.logo}/>
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">{row.phone}</TableCell>
                    <TableCell align="center">{row.mail}</TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center" style={{ padding: "0" }}>
                    {row.status === "Active" ? (
                      <>
                        <IconButton
                          className={classes.button}
                          aria-label="Disable"
                          title="View Products"
                          onClick={fetchProductId(row.id)}
                        >
                          <NavLink to={`/admin/companies/${row.id}/products`}>
                            <PageviewIcon color="primary" />
                          </NavLink>
                        </IconButton>
                        <IconButton
                          className={classes.button}
                          aria-label="Edit"
                          title="Edit"
                          id={`${row.id}`}
                          color="secondary"
                          onClick={showCompanyDetail(row.id)}
                        >
                          <NavLink to={`/admin/companies/${row.id}`}>
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
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={INDEX_PAGE_SIZE_OPTIONS}
                  align="center"
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
const Companies = injectIntl(Main);
function Sub() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCondition = useSelector(({ company }) => company.searchCondition);
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

        <h3 className="kt-subheader__title">Companies</h3>
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
            to={"/admin/companies/create"}
          >
            <span className="MuiButton-label">Create Company&nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const SubHeaderCompanies = injectIntl(Sub);
export { Companies, SubHeaderCompanies };