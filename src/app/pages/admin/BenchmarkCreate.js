import React, { Component } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  $updateItemImage
} from "../../../modules/subscription/benchmark";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class Main extends Component {
  //function Main({item,isloading})
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleCapture = this.handleCapture.bind(this);
    this.handleChangeImmediate = this.handleChangeImmediate.bind(this);
    this.classes = this.useStyles();
    this.state = { file: ""};
  }
  handleOnSubmit = e => {
    e.preventDefault();
    if (this.props.item.image == "" && this.state.file == "") {
      alert("Please upload image");
      return false;
    }
    this.props.$saveItem(this.props.history);
    return false;
  };
  handleCapture({ target }) {
    let file = URL.createObjectURL(target.files[0]);
    this.setState({ file });
    this.props.$updateItemImage(target.files);
  }
  handleChange(name) {
    return benchmark => {
      this.props.$updateItemValue(name, benchmark.target.value);
    };
  }
  handleChangeImmediate(e) {
    if(this.props.item.immediate){
      this.props.$updateItemValue('immediate', false);
      const today =  new Date();
      let month = today.getMonth()+1;
      if(month<10)month = '0'+month;
      let day = today.getDate();
      if(day<10)day = '0'+day;
      this.props.$updateItemValue('date', today.getFullYear()+'-'+month+'-'+day);
      let hour = today.getHours();
      if(hour<10)hour = '0'+hour;
      let minute = today.getMinutes();
      if(minute<10)minute = '0'+minute;
      this.props.$updateItemValue('datetime', hour+':'+minute);
    }else{
      this.props.$updateItemValue('immediate', true);
    }
  }
  useStyles() {
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
      }
    }));
  }
  render() {
    return (
      <Paper className={this.classes.root} style={{ padding: "25px" }}>
        {this.props.item ? (
          <form
            id="benchmark-form"
            onSubmit={this.handleOnSubmit}
            className={this.classes.root}
            autoComplete="off"
          >
            <Grid container spacing={3}>
              <Grid item xs={5}>
                <TextField
                  required
                  id="title"
                  label="Title"
                  error={this.props.errors.title.length === 0 ? false : true}
                  helperText={this.props.errors.title}
                  className={this.classes.textField}
                  value={this.props.item.title}
                  onChange={this.handleChange("title")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  id="time"
                  label="Time"
                  type="number"
                  value={this.props.item.time}
                  onChange={this.handleChange("time")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={4} className="mt-3">
                <FormControlLabel
                  control={
                    <Checkbox checked={this.props.item.immediate} onChange={this.handleChangeImmediate} value="true" />
                  }
                  label="Immediately"
                />
                {this.props.item.immediate===false&&(
                  <>
                    <TextField
                      id="publish-date"
                      label="Published date"
                      type="date"
                      value={this.props.item.date}
                      className={this.classes.textField}
                      onChange={this.handleChange("date")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      id="publish-time"
                      label=" "
                      type="time"
                      value={this.props.item.datetime}
                      className={this.classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={this.handleChange("datetime")}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                    />    
                  </>              
                )}
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  id="description"
                  label="Description"
                  multiline={true}
                  rows={16}
                  rowsMax={18}
                  value={this.props.item.description}
                  onChange={this.handleChange("description")}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <input
                  accept="image/*"
                  className={this.classes.input}
                  style={{ display: "none" }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={this.handleCapture}
                />
                <div className="admin-upload-image">
                  {(this.props.item.image || this.state.file) && (
                    <label htmlFor="raised-button-file">
                      <IconButton color="primary" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  )}

                  <div className="uploaded-photo">
                    {this.state.file ? (
                      <img src={this.state.file} width="200px" />
                    ) : this.props.item.image ? (
                      <img src={this.props.item.image} width="200px" />
                    ) : (
                      <label htmlFor="raised-button-file">
                        <IconButton color="primary" component="span">
                          <PhotoCamera />
                        </IconButton>
                      </label>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
          </form>
        ) : this.props.isloading ? (
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
}
const mapStateToProps = state => ({
  item: state.benchmark.item,
  errors: state.benchmark.errors,
  categories: state.benchmark.categories,
  isloading: state.benchmark.isloading
});
const mapDispatchToProps = {
  $updateItemValue,
  $saveItem,
  $updateItemImage
};
const BenchmarkCreate = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))
);

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
                Benchmark {this.props.item.code}
              </h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">New Benchmark</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              form="benchmark-form"
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
  item: state.benchmark.item,
  isSaving: state.benchmark.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $setNewItem
};
const SubHeaderBenchmarkCreate = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { BenchmarkCreate, SubHeaderBenchmarkCreate };
