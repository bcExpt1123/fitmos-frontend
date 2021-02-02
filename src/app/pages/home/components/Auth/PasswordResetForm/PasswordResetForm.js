import React from "react";

import { Formik, Form, Field } from "formik";
import { withRouter } from "react-router";

import Button from "../../Button";
import FormGroup from "../../FormGroup";
import Alert from "../../Alert";
import { requestPassword as requestPasswordAction } from "../../../redux/passwordReset/actions";

export const mapStateToProps = state => ({
  isRequestingPassword: state.passwordReset.isRequestingPassword
});

export const mapDispatchToProps = {
  requestPassword: requestPasswordAction
};

const validate = values => {
  const errors = {};

  // Email
  if (!values.email) {
    errors.email = { id: "PasswordResetForm.Error.Email.required" };
  } else if (!/.+@.+/.test(values.email)) {
    errors.email = { id: "PasswordResetForm.Error.Email.invalid" };
  }

  return errors;
};

class PasswordResetForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // form input fields states
      focused: {}
    };

    this.handleFocus = this.handleFocus.bind(this);
  }

  onSubmit = ({ email }, { setSubmitting }) => {
    const { requestPassword } = this.props;

    requestPassword({ email,history:this.props.history });
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
    const { isRequestingPassword } = this.props;

    const initialValues = { email: this.props.email || "" };

    return (
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={this.onSubmit}
        render={({ errors, isValid, touched, values }) => (
          <Form className="auth-form">
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
            <div className="hide-success">
              <Alert />
            </div>
            <Button
              type="submit"
              block
              disabled={isRequestingPassword || !isValid}
              className="fs-btn"
            >
              Enviar
            </Button>
          </Form>
        )}
      />
    );
  }
}

export default withRouter(PasswordResetForm);
