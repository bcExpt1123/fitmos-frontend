import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem
} from "../../../modules/subscription/coupon";
import { validateEmail } from "../../../modules/validate.js";
import { makeStyles } from "@material-ui/core";
import { Button, Paper, InputLabel, MenuItem, FormControl, TextField, Select, Grid} from "@material-ui/core";
class Main extends Component {
  //function Main({item,isloading})
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.classes = this.useStyles();
    this.state = { mail: "" };
  }
  handleOnSubmit = e => {
    e.preventDefault();
    if (
      this.props.item.mail == null ||
      this.props.item.mail === "" ||
      validateEmail(this.props.item.mail)
    ) {
      this.setState({ mail: "" });
      this.props.$saveItem(this.props.history);
    } else {
      this.setState({ mail: "Invalid email" });
    }
    return false;
  };
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
      <Paper className={this.classes.root} style={{ padding: "25px" }}>
        {this.props.item ? (
          <form
            id="coupon-form"
            onSubmit={this.handleOnSubmit}
            className={this.classes.root}
            autoComplete="off"
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="code"
                  label="Code"
                  error={this.props.errors.code.length === 0 ? false : true}
                  helperText={this.props.errors.code}
                  className={this.classes.textField}
                  value={this.props.item.code}
                  onChange={this.handleChange("code")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="name"
                  label="Name"
                  className={this.classes.textField}
                  value={this.props.item.name}
                  onChange={this.handleChange("name")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="mail"
                  label="Email"
                  error={this.state.mail.length === 0 ? false : true}
                  helperText={this.state.mail}
                  className={this.classes.textField}
                  value={this.props.item.mail}
                  onChange={this.handleChange("mail")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6} style={{display:'flex',alignItems:'flex-end'}}>
                <TextField
                  id="discount"
                  label="Discount"
                  className={this.classes.textField}
                  value={this.props.item.discount}
                  type="number"
                  onChange={this.handleChange("discount")}
                  margin="normal"
                />
                <Select
                    id="form"
                    value={this.props.item.form}
                    onChange={this.handleChange("form")}
                    style={{margin:'0 0 8px 0'}}
                  >
                  <MenuItem value="%">%</MenuItem>
                  <MenuItem value="$">$</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel id="renewal-label">Renewal</InputLabel>
                  <Select
                    labelId="renewal-label"
                    id="renewal"
                    value={this.props.item.renewal}
                    onChange={this.handleChange("renewal")}
                  >
                    <MenuItem value="1">Yes</MenuItem>
                    <MenuItem value="0">No</MenuItem>
                  </Select>
                </FormControl>
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
  item: state.coupon.item,
  errors: state.coupon.errors,
  isloading: state.coupon.isloading
});
const mapDispatchToProps = {
  $updateItemValue,
  $saveItem
};
const CouponCreate = injectIntl(
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
                Coupon {this.props.item.code}
              </h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">New Coupon</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              className="btn kt-subheader__btn-primary btn-primary"
              form="coupon-form"
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
  item: state.coupon.item,
  isSaving: state.coupon.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $setNewItem
};
const SubHeaderCouponCreate = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { CouponCreate, SubHeaderCouponCreate };
