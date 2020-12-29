import React, { Component, useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { injectIntl } from "react-intl";
import { makeStyles, withStyles } from "@material-ui/core";
import { Button, Paper, TextField, Grid, InputLabel, IconButton } from "@material-ui/core";
import LocalMovies from "@material-ui/icons/LocalMovies";
import {Rating,Autocomplete} from '@material-ui/lab';
import FavoriteIcon from '@material-ui/icons/Brightness1';
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Player, ControlBar } from 'video-react';
import "video-react/dist/video-react.css";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  actionTypes
} from "../../../modules/subscription/keyword";
const useStyles = ()=> {
  return makeStyles(theme => ({
    root: {
      display: "block",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    margin: {
      margin: theme.spacing(1)
    },
    input: {
      width: 200,
    },  
  }));
}
function Main() {
  const item = useSelector(({ keyword }) => keyword.item);
  const errors = useSelector(({ keyword }) => keyword.errors);
  const isloading = useSelector(({ keyword }) => keyword.isloading);
  const dispatch=useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const handleOnSubmit = e => {
    e.preventDefault();
    dispatch($saveItem(history));
    return false;
  };
  const handleChange = (name)=> {
    return event => {
      dispatch($updateItemValue(name, event.target.value));
    };
  }
  useEffect(()=>{
    dispatch({type:actionTypes.KEYWORD_UPDATE_LIST});
  },[])
  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      {item ? (
        <form
          id="keyword-form"
          onSubmit={handleOnSubmit}
          className={classes.root}
          autoComplete="off"
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                required
                id="name"
                label="Name"
                error={errors.name.length === 0 ? false : true}
                helperText={errors.name}
                className={classes.textField}
                value={item.name}
                onChange={handleChange("name")}
                margin="normal"
              />
            </Grid>
          </Grid>
          </form>
      ) : isloading ? (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          Loading...
        </h3>
      ) : (
        <h3 className="kt-subheader__title" style={{ padding: "25px" }}>
          The Item doesn't exist
        </h3>
      )}
    </Paper>
  );
}
const KeywordCreate = injectIntl(Main);

class Sub extends Component {
  componentDidMount() {
    this.id = this.props.match.params.id;
    if (this.id) this.props.$changeItem(this.id);
    else this.props.$setNewItem();
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
          {this.id ? (
            this.props.item ? (
              <h3 className="kt-subheader__title">
                Keyword {this.props.item.code}
              </h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">New Keyword</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              className="btn kt-subheader__btn-primary btn-primary"
              form="keyword-form"
              type="submit"
              disabled={this.props.isSaving}
            >
              Submit &nbsp;
            </Button>
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              onClick={this.props.history.goBack}
            >
              Back &nbsp;
            </Button>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToPropsSub = state => ({
  item: state.keyword.item,
  isSaving: state.keyword.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $setNewItem
};
const SubHeaderKeywordCreate = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { KeywordCreate, SubHeaderKeywordCreate };