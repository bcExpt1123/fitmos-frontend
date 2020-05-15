import React from "react";

import { FormattedMessage } from "react-intl";
import { Formik, Form, Field } from "formik";
import { withRouter } from "react-router";

import Button from "../../Button";
import FormGroup from "../../FormGroup";
import Alert from "../../Alert";

const validate = values => {
  const errors = {};

  // Email
  if (!values.email) {
    errors.email = { id: "LogInForm.Error.Email.required" };
  } else if (!/.+@.+/.test(values.email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }

  // Password
  if (!values.password) {
    errors.password = { id: "LogInForm.Error.Password.required" };
  }

  return errors;
};

class LogInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // form input fields states
      focused: {}
    };

    this.handleFocus = this.handleFocus.bind(this);
  }

  onSubmit = ({ email, password }, { setSubmitting }) => {
    const { logInWithPassword,history } = this.props;

    logInWithPassword({
      email,
      password,
      history
    });
    setSubmitting(false);
  };

  handleFocus(event) {
    const { name } = event.target;
    this.setState({
      focused: {
        [name]: true
      }
    });
  }

  render() {
    const { isLoggingIn, errorMessage } = this.props;

    const initialValues = { email: "", password: "" };

    return (
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={this.onSubmit}
        render={({ errors, isValid, touched, values }) => (
          <Form className="auth-form">
            {errorMessage && (
              <div className="formError">
                <FormattedMessage {...errorMessage} />
              </div>
            )}
            <FormGroup
              hasValue={Boolean(values.email)}
              name="email"
              label={"Correo"}
              focused={this.state.focused.email}
              touched={touched.email}
              valid={Boolean(values.email && !errors.email)}
            >
              <Field
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                onFocus={this.handleFocus}
              />
            </FormGroup>

            <FormGroup
              hasValue={Boolean(values.password)}
              name="password"
              label={"Contrasena"}
              focused={this.state.focused.password}
              touched={touched.password}
              valid={Boolean(values.password && !errors.password)}
            >
              <Field
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                onFocus={this.handleFocus}
              />
            </FormGroup>
            <div className="hide-success">
              <Alert />
            </div>
            <Button
              type="submit"
              block
              disabled={isLoggingIn || !isValid}
              className="fs-btn"
            >
              Iniciar sesión
            </Button>
          </Form>
        )}
      />
    );
  }
}

export default withRouter(LogInForm);
