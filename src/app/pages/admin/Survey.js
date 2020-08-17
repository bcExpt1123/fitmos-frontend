import React, { Component,useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {spacing} from '@material-ui/system';
import Box from '@material-ui/core/Box';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TextField from '@material-ui/core/TextField';
import { red } from "@material-ui/core/colors";      
import TablePaginationActions from "../../components/pagination/TablePaginationActions";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";    
import TableRow from "@material-ui/core/TableRow";
import { NavLink } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import DisableIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CustomerOverview from "./CustomerOverview";
import { CustomerTransactions } from "./CustomerTransactions";
import {
  $actionSurveyTitleSave,
  $actionSurveyItemSave,
  $updateItemValue,
  $fetchIndex,
  $page,
  $pageSize,
  $changeConditionValue,

} from "../../../modules/subscription/survey";
import { SurveyActive } from "./SurveyActive";
import { SurveyInactive } from "./SurveyInactive";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign:'center',
    color:theme.palette.text.secondary,
	},
	table: {
		minWidth: 500,
		cursor:'pointer'
  },
  icon: {
    margin: theme.spacing(2),
    paddingTop:"20px"
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
const Main = () =>{
  const classes=useStyles();
  const handleChangeTab = (event) => {
  };
  return(
		<>
			<Paper>
        <div id="customer-form" className={classes.icon}>
          <Tabs defaultActiveKey="Active" id="uncontrolled-tab-example" onChange={handleChangeTab}>
            <Tab eventKey="Active" title="Active" >
              <SurveyActive />
            </Tab>
            <Tab eventKey="Inactive" title="Inactive">
              <SurveyInactive />
            </Tab>
          </Tabs>
        </div>
			</Paper>
		</>
  );
};
const Survey = injectIntl(Main);
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

        <h3 className="kt-subheader__title">Surveys</h3>
        <span className="kt-subheader__separator kt-subheader__separator--v" />
        <span className="kt-subheader__desc">
          <TextField
            id="search"
            label="search"
            className={classes.textField}
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
            to={"/admin/survey/create"}
          >
            <span className="MuiButton-label">Create &nbsp;</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
const SubHeaderSurvey = injectIntl(Sub);
export { Survey, SubHeaderSurvey };

