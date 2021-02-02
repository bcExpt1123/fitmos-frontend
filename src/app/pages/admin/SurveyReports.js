import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import { makeStyles } from "@material-ui/core";
import { Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, colors} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import Rating from '@material-ui/lab/Rating';
import {$fetchSurveyReport,$pageReport,$pageSizeReport,$moreDetail} from "../../../modules/subscription/survey";
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
  },
  dialog: {
    position: 'absolute',
    width:'450px',
    maxHeight:'600px',
    top: 50,
  },
  question:{
    padding:'10px 20px',
    background:'#0abb87', 
    borderRadius:'8px',
    color:'white',
  },
  answer:{
    padding:'10px 20px',
    background:'#00000061', 
    borderRadius:'8px',
    color:'white',
    marginTop:'10px'
  }
}));
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID",width:"auto" },
  { id: "customers", numeric: false, disablePadding: false, label: "Customers" ,width:"auto"},
  { id: "time", numeric: false, disablePadding: false, label: "Report Date" ,width:"auto"},
  { id: "moredetail", numeric: false, disablePadding: false, label: "More Detail" ,width:"auto"}
];
function Main() {
  const classes = useStyles();
  const dispatch=useDispatch();
  const survey = useSelector(({ survey }) => survey);
  const surveyReport = survey.data_report;
  const viewDetail = survey.viewReport;
  console.log(survey);
  const meta = survey.metaReport;
  const page = survey.metaReport.page - 1;
  const rowsPerPage = survey.metaReport.pageSize;
  const handleChangePage = (event, newPage) => {
    dispatch($pageReport(newPage + 1));
  };

  const handleChangeRowsPerPage = event => {
    dispatch($pageSizeReport(parseInt(event.target.value, 10)));
  };
  const [open, setOpen] = React.useState(false);

  const moreDetail = (id) => event => {
    dispatch($moreDetail(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
              {surveyReport.length>0?(
                surveyReport.map(row => (
                  <TableRow key={row.id}>
                    <TableCell align="center" scope="row">{row.id}</TableCell>
                    <TableCell align="center">{row.first_name}</TableCell>
                    <TableCell align="center">{(row.created_at).substring(0, 10)}</TableCell>
                    <TableCell align="center" style={{ padding: "0" }}>
                      <IconButton
                        color="secondary"
                        className={classes.button}
                        aria-label="More Detail"
                        title="More Detail"
                        onClick={moreDetail(row.id)}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))):(
                  <TableRow>
                    <TableCell colSpan={4} align="center"><b>There are no records.</b></TableCell>
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
          <div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              classes={{paper: classes.dialog}}
            >
              <DialogContent style={{marginTop:"30px"}}>
                {viewDetail != null &&
                viewDetail.map(row => (
                  <DialogContentText id="alert-dialog-description" key={row.id}>
                    {row.question==='text'?(
                      <div>
                        <p className={classes.question} >{row.label}</p>
                        <p className={classes.answer} >{row.text_answer}</p>
                      </div>
                    ):(<></>)}
                  </DialogContentText>
                ))}
                {viewDetail != null &&
                viewDetail.map(row => (
                  <DialogContentText id="alert-dialog-description" key={row.label}>
                    {row.question==='level'?(
                      <div>
                        <p className={classes.question} >{row.label}</p>
                        <p className={classes.answer}><Rating name="read-only" value={row.level_answer} readOnly /></p>
                      </div>
                    ):(<></>)}
                  </DialogContentText>
                ))}
                {viewDetail != null &&
                viewDetail.map(row => (
                  <DialogContentText id="alert-dialog-description" key={row.larbel}>
                    {row.question==='select'?(
                      <div>
                        <p className={classes.question} >{row.label}</p>
                        <p className={classes.answer} >{row.select_answer}</p>
                      </div>
                    ):(<></>)}
                  </DialogContentText>
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} style={{padding:'20px'}} color="primary" autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Paper>
    </>
  );
}
const SurveyReports = injectIntl(Main);
function Sub({match}) {
  useEffect(() => { if(match.params.id){ dispatch($fetchSurveyReport(match.params.id)); }}, []);// eslint-disable-line react-hooks/exhaustive-deps
  const dispatch = useDispatch();
  const survey = useSelector(({ survey }) => survey);
  const surveyReport = survey.data_report
  return (
    <>
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
          {(surveyReport.length>0) ? (
            <h3 className="kt-subheader__title">
                {surveyReport[0].title}
            </h3>
          ):(<></>)}
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc"></span>
      </div>
      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          <NavLink
            className="btn kt-subheader__btn-primary  btn-primary MuiButton-root"
            aria-label="Back"
            title="Back"
            to={"/admin/survey"}
          >
            <span className="MuiButton-label">Back &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
    </>
  );
}
const SubHeaderSurveyReports = injectIntl(Sub);
export { SurveyReports, SubHeaderSurveyReports };
