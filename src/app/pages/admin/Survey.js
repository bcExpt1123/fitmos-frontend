import React from "react";
import { useDispatch } from "react-redux";
import { injectIntl } from "react-intl";
import { makeStyles } from "@material-ui/styles";
import { Paper, TextField, colors } from '@material-ui/core';
import { Tabs, Tab } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
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
      color: colors.red[800]
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

