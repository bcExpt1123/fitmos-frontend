import React, { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { injectIntl } from "react-intl";
import { makeStyles,useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {
  $changeItem
} from "../../../modules/subscription/weekWorkout";
import WeekEditor from "./WeekEditor";

const useStyles = makeStyles(theme => ({}));
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};
function Main({ history}) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }
  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Monday" />
          <Tab label="Tuesday" />
          <Tab label="Wednesday" />
          <Tab label="Thursday" />
          <Tab label="Friday" />
          <Tab label="Saturday" />
          <Tab label="Sunday" />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}><WeekEditor weekDay={0} history={history}/></TabContainer>
        <TabContainer dir={theme.direction}><WeekEditor weekDay={1} history={history}/></TabContainer>
        <TabContainer dir={theme.direction}><WeekEditor weekDay={2} history={history}/></TabContainer>
        <TabContainer dir={theme.direction}><WeekEditor weekDay={3} history={history}/></TabContainer>
        <TabContainer dir={theme.direction}><WeekEditor weekDay={4} history={history}/></TabContainer>
        <TabContainer dir={theme.direction}><WeekEditor weekDay={5} history={history}/></TabContainer>
        <TabContainer dir={theme.direction}><WeekEditor weekDay={6} history={history}/></TabContainer>
      </SwipeableViews>
    </Paper>
  );
}
const SubscriptionWeekCMS = injectIntl(
  withRouter(Main)
);

function Sub({history,match}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if(match.params.id){
      dispatch($changeItem(match.params.id, history));
    }else{
      console.log('id not exist');
      console.log(match.params.id)
    }
  }, []);

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
        {true ? (
          <>
            <h3 className="kt-subheader__title">Subscription Week CMS</h3>
            <span className="kt-subheader__separator kt-subheader__separator--v" />
            <span className="kt-subheader__desc"></span>
          </>
        ) : true ? (
          <h3 className="kt-subheader__title">Loading...</h3>
        ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )}
      </div>

      <div className="kt-subheader__toolbar">
        <div className="kt-subheader__wrapper"></div>
      </div>
    </>
  );
}
const SubHeaderSubscriptionWeekCMS = injectIntl(
  withRouter(Sub)
);
export { SubscriptionWeekCMS, SubHeaderSubscriptionWeekCMS };
