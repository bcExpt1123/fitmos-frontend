import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {
  $changeItem,
  $saveItem,
  $cloneItem,
  $updateItemValue,
  $updateItemImage
} from "../../../modules/subscription/service";

class Main extends Component {
  //function Main({item,isloading})
  constructor(props) {
    super(props);
    this.handleCapture = this.handleCapture.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.classes = this.useStyles();
    this.state = { file: null };
  }
  handleOnSubmit = e => {
    e.preventDefault();
    this.props.$saveItem();
    return false;
  };
  handleCapture({ target }) {
    let file = URL.createObjectURL(target.files[0]);
    this.setState({ file });
    this.props.$updateItemImage(target.files);
  }
  handleChange(name) {
    return event => {
      this.props.$updateItemValue(name, event.target.value);
    };
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
      <>
        <Paper className={this.classes.root} style={{ padding: "25px" }}>
          {this.props.item ? (
            <>
              <form
                id="subscroption-manager-form"
                onSubmit={this.handleOnSubmit}
                className={this.classes.root}
                autoComplete="off"
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={9}>
                    <Grid container spacing={3}>
                      <Grid item sm={4}>
                        <TextField
                          required
                          id="subscription-name"
                          label="Subscription Name"
                          className={this.classes.textField}
                          value={this.props.item.title}
                          onChange={this.handleChange("title")}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <TextField
                          id="1-month"
                          label="1 month"
                          className={this.classes.textField}
                          value={this.props.item.monthly}
                          type="number"
                          onChange={this.handleChange("monthly")}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <TextField
                          id="3-month"
                          label="3 month"
                          className={this.classes.textField}
                          value={this.props.item.quarterly}
                          type="number"
                          onChange={this.handleChange("quarterly")}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <TextField
                          id="6-month"
                          label="6 month"
                          className={this.classes.textField}
                          value={this.props.item.semiannual}
                          type="number"
                          onChange={this.handleChange("semiannual")}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item sm={2}>
                        <TextField
                          id="12-month"
                          label="12 month"
                          className={this.classes.textField}
                          type="number"
                          value={this.props.item.yearly}
                          onChange={this.handleChange("yearly")}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <TextField
                          id="free-duration"
                          label="Free duration"
                          className={this.classes.textField}
                          type="number"
                          value={this.props.item.free_duration}
                          onChange={this.handleChange("free_duration")}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item sm={4}>
                      </Grid>
                      <Grid item sm={4}>
                        <FormControl className={this.classes.formControl}>
                          <InputLabel id="new-customer-coupon-label">Default Frequency</InputLabel>
                          <Select
                            labelId="new-customer-coupon-label"
                            id="default"
                            value={this.props.item.frequency}
                            onChange={this.handleChange("frequency")}
                            style={{width:'200px'}}
                          >
                            <MenuItem value="">None</MenuItem>
                            {this.props.item.monthly!=null && this.props.item.monthly!=""&&(
                              <MenuItem value="1">Monthly</MenuItem>
                            )}
                            {this.props.item.quarterly!=null && this.props.item.quarterly!=""&&(
                              <MenuItem value="3">Quarterly</MenuItem>
                            )}
                            {this.props.item.semiannual!=null && this.props.item.semiannual!=""&&(
                              <MenuItem value="6">Semiannual</MenuItem>
                            )}
                            {this.props.item.yearly!=null && this.props.item.yearly!=""&&(
                              <MenuItem value="12">Yearly</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item sm={12}>
                        <TextField
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
                    </Grid>
                  </Grid>
                  <Grid item xs={12}  sm={3}>
                    <input
                      accept="image/*"
                      className={this.classes.input}
                      style={{ display: "none" }}
                      id="raised-button-file"
                      multiple
                      type="file"
                      onChange={this.handleCapture}
                    />
                    <label htmlFor="raised-button-file">
                      <IconButton color="primary" component="span">
                        <PhotoCamera />
                      </IconButton>
                    </label>
                    <div>
                      {this.state.file ? (
                        <img src={this.state.file} width="200px" />
                      ) : (
                        <img src={this.props.item.photo_path} width="200px" />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </form>
            </>
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
      </>
    );
  }
}
const mapStateToProps = state => ({
  item: state.service.item,
  isloading: state.service.isloading
});
const mapDispatchToProps = {
  $updateItemValue,
  $saveItem,
  $updateItemImage
};
const SubscriptionManagerEdit = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Main)
);

class Sub extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    const item = this.props.item;
    this.props.$changeItem(id);
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
          {this.props.item ? (
            <>
              <h3 className="kt-subheader__title">
                Subscription {this.props.item.title}
              </h3>
              <span className="kt-subheader__separator kt-subheader__separator--v" />
              <span className="kt-subheader__desc"></span>
            </>
          ) : this.props.isloading ? (
            <h3 className="kt-subheader__title">Loading...</h3>
          ) : (
            <h3 className="kt-subheader__title">There is no item</h3>
          )}
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              form="subscroption-manager-form"
              type="submit"
              disabled={this.props.isSaving}
            >
              Save &nbsp;
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
  item: state.service.item,
  isloading: state.service.isloading,
  isSaving: state.service.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $cloneItem
};
const SubHeaderSubscriptionManagerEdit = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { SubscriptionManagerEdit, SubHeaderSubscriptionManagerEdit };
