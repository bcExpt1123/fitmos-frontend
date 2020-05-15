import React, { useState, Component } from "react";
import { useParams } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { validateEmail } from "../../../modules/validate.js";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FormGroup from "../home/components/FormGroup";
import { updateAdminProfile } from "../home/redux/userSettings/actions";
const validate = withPassword => ({
  email,
  name,
  current_password,
  password,
  confirm_password
}) => {
  const errors = {};
  console.log(withPassword);
  // Email
  if (!email) {
    errors.email = { id: "LogInForm.Error.Email.required" };
  } else if (!/.+@.+/.test(email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }
  if (!name) {
    errors.name = { id: "SettingsForm.Profile.Error.FirstName.required" };
  }
  // Password
  if (password !== confirm_password) {
    errors.confirm_password = {
      id: "LogInForm.Error.Password.required"
    };
  }
  if (withPassword && (password || confirm_password) && !current_password) {
    errors.current_password = {
      id: "LogInForm.Error.Password.required"
    };
  }

  if (Object.keys(errors).length) {
    return errors;
  }

  return undefined;
};
const useStyles = () => {
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
};

const Main = ({ updateAdminProfile, currentUser }) => {
  const [focused, setFocused] = useState({});
  const classes = useStyles();
  const onSubmit = (
    { name, email, current_password, password, confirm_password },
    { setSubmitting, setErrors, setFieldValue }
  ) => {
    let params = {
      name,
      email,
      id: currentUser.id
    };
    if (password) {
      params.current_password = current_password;
      params.password = password;
      params.confirm_password = confirm_password;
    }
    return new Promise((resolve, reject) => {
      updateAdminProfile({
        params,
        resolve,
        reject
      });
    })
      .then(() => {
        setFieldValue("current_password", "");
        setFieldValue("password", "");
        setFieldValue("confirm_password", "");
      })
      .catch(errors => {
        setErrors(errors);
      })
      .finally(() => setSubmitting(false));
  };
  const handleFocus = event => {
    const { name } = event.target;
    setFocused({
      [name]: true
    });
  };

  return (
    <Paper className={classes.root} style={{ padding: "25px" }}>
      <Formik
        initialValues={{
          name: currentUser.name,
          email: currentUser.email,
          current_password: "",
          password: "",
          confirm_password: ""
        }}
        validate={validate(true)}
        onSubmit={onSubmit}
        render={({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isValid,
          errors
        }) => (
          <Form className="auth-form admin_user_profile">
            <Row>
              <Col xs={12} md={2}></Col>
              <Col xs={12} md={8}>
                <FormGroup
                  hasValue={Boolean(values.name)}
                  name="name"
                  htmlFor="name"
                  label={"Name"}
                  focused={focused.name}
                  touched={touched.name}
                  valid={Boolean(values.name && !errors.name)}
                >
                  <Field
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="given-name"
                    onFocus={handleFocus}
                  />
                </FormGroup>

                <FormGroup
                  hasValue={Boolean(values.email)}
                  name="email"
                  htmlFor="email"
                  label={"Email"}
                  focused={focused.email}
                  touched={touched.email}
                  valid={Boolean(values.email && !errors.email)}
                >
                  <Field
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    onFocus={handleFocus}
                  />
                </FormGroup>
                <FormGroup
                  hasValue={Boolean(values.current_password)}
                  name="current_password"
                  htmlFor="current_password"
                  label={"Current password"}
                  placeholder="********"
                  focused={focused.current_password}
                  touched={touched.current_password}
                  valid={true}
                >
                  <Field
                    id="current_password"
                    type="password"
                    name="current_password"
                    autoComplete="current_password"
                    onFocus={handleFocus}
                  />
                </FormGroup>
                <FormGroup
                  hasValue={Boolean(values.password)}
                  name="password"
                  htmlFor="password"
                  label={"Password"}
                  focused={focused.password}
                  touched={touched.password}
                  valid={true}
                >
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="password"
                    onFocus={handleFocus}
                  />
                </FormGroup>
                <FormGroup
                  hasValue={Boolean(values.confirm_password)}
                  name="confirm_password"
                  htmlFor="confirm_password"
                  label={"Confirm password"}
                  focused={focused.confirm_password}
                  touched={touched.confirm_password}
                  valid={Boolean(!errors.confirm_password)}
                >
                  <Field
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    autoComplete="confirm_password"
                    onFocus={handleFocus}
                  />
                </FormGroup>
                <Button type="submit" className="btn btn-primary">
                  Update
                </Button>
              </Col>
              <Col xs={12} md={2}></Col>
            </Row>
          </Form>
        )}
      />
    </Paper>
  );
};
const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateAdminProfile
};
const UserProfile = connect(mapStateToProps, mapDispatchToProps)(Main);

class Sub extends Component {
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
          {this.props.currentUser.type == "admin" ? (
            this.props.currentUser ? (
              <h3 className="kt-subheader__title">My Profile</h3>
            ) : this.props.isloading ? (
              <h3 className="kt-subheader__title">Loading...</h3>
            ) : (
              <h3 className="kt-subheader__title">There is no item</h3>
            )
          ) : (
            <h3 className="kt-subheader__title">Customer User</h3>
          )}
          <span className="kt-subheader__separator kt-subheader__separator--v" />
          <span className="kt-subheader__desc"></span>
        </div>

        <div className="kt-subheader__toolbar">
          <div className="kt-subheader__wrapper"></div>
        </div>
      </>
    );
  }
}
const mapStateToPropsSub = state => ({
  currentUser: state.auth.currentUser
});
const mapDispatchToPropsSub = {};
const SubHeaderUserProfile = injectIntl(
  connect(mapStateToPropsSub, mapDispatchToPropsSub)(Sub)
);
export { UserProfile, SubHeaderUserProfile };
