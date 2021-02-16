import React, { useState } from "react";
import { bindActionCreators } from "redux";

import { FormattedMessage } from "react-intl";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import { registerWithPassword } from "../../../redux/registration/actions";

import Button from "../../Button";
import FormGroup from "../../FormGroup";
import Alert from "../../Alert";

const validate = ({ firstName, lastName, email, password }) => {
  const errors = {};

  // First name
  if (!firstName) {
    errors.firstName = {
      id: "RegistrationForm.Error.Field.firstName.required"
    };
  }

  // Last name
  if (!lastName) {
    errors.lastName = { id: "RegistrationForm.Error.Field.lastName.required" };
  }

  // Email
  if (!email) {
    errors.email = { id: "RegistrationForm.Error.Field.email.required" };
  } else if (!/.+@.+/.test(email)) {
    errors.email = { id: "RegistrationForm.Error.Field.email.invalid" };
  }

  // Password
  if (!password) {
    errors.password = { id: "RegistrationForm.Error.Field.password.required" };
  }

  return errors;
};

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

const RegistrationForm = ({
  actions,
  isRegistering,
  returnTo,
  referralId,
  applicationSource,
  profile
}) => {
  const {
    gender,
    level,
    place,
    goal,
    info: { birthday, weight, weightUnit, height, heightUnit }
  } = profile;
  const [focused, setFocused] = useState({});
  const history = useHistory();
  const onSubmit = (
    { email, password, firstName, lastName },
    { setSubmitting }
  ) => {
    actions.registerWithPassword({
      email,
      password,
      firstName,
      lastName,
      returnTo,
      referralId,
      applicationSource,
      gender,
      level,
      place,
      goal,
      birthday,
      weight,
      weightUnit,
      height,
      heightUnit,
      history
    });
    setSubmitting(false);
  };

  const handleFocus = event => {
    const { name } = event.target;
    setFocused({
      [name]: true
    });
  };
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
      render={({ errors, isValid, touched, values }) => (
        <Form className="row auth-form">
          <div className="col-12 col-md-6">
            <FormGroup
              hasValue={Boolean(values.firstName)}
              name="firstName"
              htmlFor="registration-first-name"
              label={
                touched.firstName && errors.firstName ? (
                  <FormattedMessage {...errors.firstName} />
                ) : (
                  <FormattedMessage id="RegistrationForm.Field.FirstName" />
                )
              }
              focused={focused.firstName}
              touched={touched.firstName}
              valid={Boolean(values.firstName && !errors.firstName)}
              skipErrorMessage
            >
              <Field
                id="registration-first-name"
                type="text"
                name="firstName"
                autoComplete="given-name"
                onFocus={handleFocus}
              />
            </FormGroup>
          </div>
          <div className="col-12 col-md-6">
            <FormGroup
              hasValue={Boolean(values.lastName)}
              name="lastName"
              htmlFor="registration-last-name"
              label={
                touched.lastName && errors.lastName ? (
                  <FormattedMessage {...errors.lastName} />
                ) : (
                  <FormattedMessage id="RegistrationForm.Field.LastName" />
                )
              }
              focused={focused.lastName}
              touched={touched.lastName}
              valid={Boolean(values.lastName && !errors.lastName)}
              skipErrorMessage
            >
              <Field
                id="registration-last-name"
                type="text"
                name="lastName"
                autoComplete="family-name"
                onFocus={handleFocus}
              />
            </FormGroup>
          </div>
          <div className="col-12 col-md-12">
            <FormGroup
              hasValue={Boolean(values.email)}
              name="email"
              htmlFor="registration-email"
              label={
                touched.email && errors.email ? (
                  <FormattedMessage {...errors.email} />
                ) : (
                  <FormattedMessage id="RegistrationForm.Field.Email" />
                )
              }
              focused={focused.email}
              touched={touched.email}
              valid={Boolean(values.email && !errors.email)}
              skipErrorMessage
            >
              <Field
                id="registration-email"
                type="email"
                name="email"
                autoComplete="email"
                onFocus={handleFocus}
              />
            </FormGroup>
          </div>
          <div className="col-12 col-md-12">
            <FormGroup
              hasValue={Boolean(values.password)}
              name="password"
              htmlFor="registration-password"
              label={
                touched.password && errors.password ? (
                  <FormattedMessage {...errors.password} />
                ) : (
                  <FormattedMessage id="RegistrationForm.Field.Password" />
                )
              }
              focused={focused.password}
              touched={touched.password}
              valid={Boolean(values.password && !errors.password)}
              skipErrorMessage
            >
              <Field
                id="registration-password"
                type="password"
                name="password"
                autoComplete="new-password"
                onFocus={handleFocus}
              />
            </FormGroup>
          </div>
          <div className="hide-success">
            <Alert />
          </div>
          <Button
            type="submit"
            block
            size="sm"
            disabled={isRegistering || !isValid}
            className="fs-btn"
          >
            <FormattedMessage id="RegistrationForm.Button.Register" />
          </Button>
        </Form>
      )}
    />
  );
};

RegistrationForm.defaultProps = {
  returnTo: undefined,
  referralId: undefined,
  applicationSource: undefined
};

RegistrationForm.propTypes = {
  isRegistering: PropTypes.bool.isRequired,
  returnTo: PropTypes.string,
  referralId: PropTypes.string,
  applicationSource: PropTypes.string,
  actions: PropTypes.shape({
    registerWithPassword: PropTypes.func.isRequired
  }).isRequired
};

export const mapStateToProps = state => ({
  isRegistering: state.registration.isRegistering
});

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      registerWithPassword
    },
    dispatch
  )
});

export default RegistrationForm;
