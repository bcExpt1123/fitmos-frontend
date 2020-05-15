import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router";
import {
  $setNewItem,
  $saveItem,
  $updateItemValue,
  $changeItem,
  $requestRoles,
  $setErrorEmail
} from "../../../modules/subscription/admin";
import { validateEmail } from "../../../modules/validate.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";

class Main extends Component {
  //function Main({item,isloading})
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.classes = this.useStyles();
    this.state = { password:"" };
  }
  componentDidMount(){
    this.props.$requestRoles();
  }
  handleOnSubmit = e => {
    e.preventDefault();
    let validate = true;
    if(this.props.item.id == null && this.props.item.password == ""){
      validate = false;
      this.setState({ password: "Password is required" });
    }else if( this.props.item.password != this.props.item.confirm_password){
      validate = false;
      this.setState({ password: "Password is unmatched" });
    }else{
      this.setState({ password: "" });
    }
    if (
      validateEmail(this.props.item.email)
    ) {
      this.props.$setErrorEmail("");
    } else {
      validate = false;
      this.props.$setErrorEmail("Invalid email");
    }
    if(validate)this.props.$saveItem(this.props.history);
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
            id="user-form"
            onSubmit={this.handleOnSubmit}
            className={this.classes.root}
            autoComplete="off"
          >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="name"
                  label="Name"
                  error={this.props.errors.name.length === 0 ? false : true}
                  helperText={this.props.errors.name}
                  className={this.classes.textField}
                  value={this.props.item.name}
                  onChange={this.handleChange("name")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="email"
                  label="Email"
                  error={this.props.errors.email.length === 0 ? false : true}
                  helperText={this.props.errors.email}
                  className={this.classes.textField}
                  value={this.props.item.email}
                  onChange={this.handleChange("email")}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="password"
                  label="Password"
                  error={this.state.password.length === 0 ? false : true}
                  helperText={this.state.password}
                  className={this.classes.textField}
                  value={this.props.item.password}
                  onChange={this.handleChange("password")}
                  type="password"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="confirm_password"
                  label="Confirm Password"
                  error={this.state.password.length === 0 ? false : true}
                  helperText={this.state.password}
                  className={this.classes.textField}
                  value={this.props.item.confirm_password}
                  onChange={this.handleChange("confirm_password")}
                  type="password"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl className={this.classes.formControl}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={this.props.item.role}
                    onChange={this.handleChange("role")}
                  >
                    {this.props.roles.map(role=>
                      <MenuItem value={role.name}>{role.name}</MenuItem>
                    )}
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
  item: state.admin.item,
  roles:state.admin.roles,
  errors: state.admin.errors,
  isloading: state.admin.isloading
});
const mapDispatchToProps = {
  $updateItemValue,
  $saveItem,
  $setErrorEmail,
  $requestRoles
};
const UserCreate = injectIntl(
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
                Admin User {this.props.item.name}
              </h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">New Admin User</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper">
            <Button
              type="button"
              className="btn kt-subheader__btn-primary btn-primary"
              form="user-form"
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
  item: state.admin.item,
  isSaving: state.admin.isSaving
});
const mapDispatchToPropsSub = {
  $changeItem,
  $setNewItem
};
const SubHeaderUserCreate = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(withRouter(Sub))
);
export { UserCreate, SubHeaderUserCreate };
