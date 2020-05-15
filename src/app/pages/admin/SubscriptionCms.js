import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { Calendar, CalendarControls } from "react-yearly-calendar";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  $datePicked,
  $prevYear,
  $nextYear,
  $changeItem
} from "../../../modules/subscription/cms";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
const useStyles = makeStyles(theme => ({}));

function Main({ year, dates, history, $datePicked, $prevYear, $nextYear }) {
  const classes = useStyles();
  const onPrevYear = () => {
    $prevYear();
  };
  const onNextYear = () => {
    $nextYear();
  };
  const onDatePicked = date => {
    $datePicked(date.toDate(), history);
  };
  const today = new Date();
  const currentYear = today.getFullYear();
  let customCSSclasses = {
    full: dates,
    weekend: "Sat,Sun"
  };
  if (currentYear < year) {
    customCSSclasses.active = {
      start: year + "-01-01",
      end: year + "-12-31"
    };
  } else if (currentYear > year) {
    customCSSclasses.past = {
      start: year + "-01-01",
      end: year + "-12-31"
    };
  } else {
    let month = today.getMonth() + 1;
    if (month < 9) month = "0" + month;
    let date = today.getDate();
    if (date < 9) date = "0" + date;
    const todayString = currentYear + "-" + month + "-" + date;
    customCSSclasses.past = {
      start: year + "-01-01",
      end: todayString
    };
    customCSSclasses.active = {
      start: todayString,
      end: year + "-12-31"
    };
  }
  return (
    <Paper className={classes.root}>
      <div className="year-calendar">
        <CalendarControls
          year={year}
          onPrevYear={onPrevYear}
          onNextYear={onNextYear}
        />
        <Calendar
          year={year}
          firstDayOfWeek={1}
          onPickDate={onDatePicked}
          customClasses={customCSSclasses}
        />
      </div>
    </Paper>
  );
}
const mapStateToProps = state => ({
  year: state.cms.year,
  dates: state.cms.dates
});
const mapDispatchToProps = {
  $prevYear,
  $nextYear,
  $datePicked
};
const SubscriptionCMS = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))
);

class Sub extends Component {
  componentDidMount() {
    this.id = this.props.match.params.id;
    this.props.$changeItem(this.id, this.props.history);
  }
  render() {
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
              <h3 className="kt-subheader__title">Subscription CMS </h3>
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
}
const mapDispatchToPropsSub = {
  $changeItem
};
const SubHeaderSubscriptionCMS = injectIntl(
  connect(null, mapDispatchToPropsSub)(withRouter(Sub))
);
export { SubscriptionCMS, SubHeaderSubscriptionCMS };
