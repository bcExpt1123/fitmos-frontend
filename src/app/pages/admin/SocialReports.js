import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import {Table, TableHead, TableBody, TableCell, TableFooter, TablePagination, TableRow, Paper, IconButton, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress,  }from "@material-ui/core";
import { Modal } from "react-bootstrap";
import { makeStyles } from "@material-ui/core";
import FlagIcon from "@material-ui/icons/Flag";
import CheckIcon from "@material-ui/icons/Check";
import ViewIcon from "@material-ui/icons/Visibility";
import RedoIcon from "@material-ui/icons/Redo";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { INDEX_PAGE_SIZE_OPTIONS } from "../../../modules/constants/constants";
import {
  $pageSize,
  $page,
  $fetchIndex,
  $changeConditionValue,
  $restore,
  $complete
} from "../../../modules/subscription/report";

const useStyles = makeStyles({
  table: {
    minWidth: 500
  },
  exportSpinner:{
    marginBottom:'-5px'
  }
});
const headRows = [
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type"
  },
  {
    id: "object_id",
    numeric: false,
    disablePadding: false,
    label: "Object ID"
  },
  { id: "reporter", numeric: false, disablePadding: false, label: "Reporter" },
  { id: "content", numeric: false, disablePadding: false, label: "Content" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "action", numeric: false, disablePadding: false, label: "Actions" }
];
function Main() {
  const classes = useStyles();
  useEffect(() => {
    dispatch($fetchIndex())
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const report = useSelector(({ report }) => report);
  const page=report.meta.page-1;
  const reports= report.data;
  const meta=report.meta;
  const rowsPerPage = meta.pageSize;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meta.total - page * rowsPerPage);
  const dispatch = useDispatch();
  const handleChangePage = (event, newPage) => {
    dispatch($page(newPage + 1));
  };
  const handleChangeRowsPerPage = event => {
    dispatch($pageSize(parseInt(event.target.value, 10)));
  };
  const actionComplete = id => event => {
    if (window.confirm("Are you sure to complete this item?"))  dispatch($complete(id));
  };
  const actionRestore = id => event => {
    dispatch($restore(id));
  };
  const _getReadMoreParts = ({text, readMoreCharacterLimit}) => {
    let teaserText;
    let remainingText;
    let remainingWordsArray = [];

    if (text) {
        const teaserWordsArray = text.split(' ');

        while (teaserWordsArray.join(' ').length > readMoreCharacterLimit ) {
            remainingWordsArray.unshift(teaserWordsArray.pop());
        }

        teaserText = teaserWordsArray.join(' ');

        if (remainingWordsArray.length > 0) {
            remainingText = remainingWordsArray.join(' ');
        }
    }

    return {
        teaserText,
        remainingText
    };
  };
  const displayText = (text)=>{
    const readMoreCharacterLimit = 50;
    let {
      teaserText,
      remainingText
     } = _getReadMoreParts({text, readMoreCharacterLimit});
     if(text.length>readMoreCharacterLimit){
      return teaserText.replace(/\s*$/, "")+'...';
     }else{
       return text;
     }
  }
  const [open, setOpen] = useState(false);
  const [reportItem, setReportItem] = useState(false);
  const openContent = (item)=>()=>{
    setOpen(true);
    setReportItem(item);
  }
  const handleClose = ()=>{
    setOpen(false);
  }
  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {headRows.map(row => (
                <TableCell
                  key={row.id}
                  align={row.numeric ? "right" : "left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={false}
                >
                  {row.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {reports != null &&
              reports.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.object_id}</TableCell>
                  <TableCell align="left">{row.customer.first_name} {row.customer.last_name}</TableCell>
                  <TableCell align="left"><span className="cursor-pointer" onClick={openContent(row)}>{displayText(row.content)}</span></TableCell>
                  <TableCell align="left">
                    <span
                      className={classnames(
                        " btn btn-bold btn-xs btn-font-sm normal",
                        {
                          "btn-label-success": row.status === "completed",
                          "btn-label-danger": row.status === "wait"
                        }
                      )}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell align="left" style={{ padding: "0" }}>
                    {row.status === "completed" ? (
                      <>
                        <IconButton
                          color="secondary"
                          className={classes.button}
                          aria-label="Restore"
                          title="Restore"
                          onClick={actionRestore(row.id)}
                        >
                          <RedoIcon color="blue" />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          className={classes.button}
                          aria-label="Complete"
                          title="Complete"
                          onClick={actionComplete(row.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 43 * emptyRows }}>
                <TableCell colSpan={6} />
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
      <Modal
      // dialogClassName="post-modal"
      show={open}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        {reportItem&&<div className="textarea-pre">{reportItem.content}</div>}
      </Modal.Body>
    </Modal>
    </Paper>
  );
}
const SocialReports = injectIntl(Main);
function Sub() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCondition = useSelector(({ report }) => report.searchCondition);
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

        <h3 className="kt-subheader__title">SocialReports</h3>
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
        <span>
          <FormControl className={classes.formControl}>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={searchCondition.shape}
              onChange={handleChange("shape")}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="post">Post</MenuItem>
              <MenuItem value="profile">Profile</MenuItem>
            </Select>
          </FormControl>
        </span>
        <span>
          <FormControl className={classes.formControl}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={searchCondition.status}
              onChange={handleChange("status")}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </span>
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper">
          
        </div>
      </div>
    </>
  );
}

const SubHeaderSocialReports = injectIntl(Sub);
export { SocialReports, SubHeaderSocialReports };
