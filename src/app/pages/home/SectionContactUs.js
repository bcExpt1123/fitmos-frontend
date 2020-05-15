import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import Button from "./components/Button";
import FormGroup from "./components/FormGroup";
import { http } from "./services/api";
import { connect } from "react-redux";
import { addAlertMessage } from "./redux/alert/actions";

const validate = values => {
  const errors = {};

  // Email
  if (!values.email) {
    errors.email = { id: "LogInForm.Error.Email.required" };
  } else if (!/.+@.+/.test(values.email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }

  // Name
  if (!values.name) {
    errors.name = { id: "LogInForm.Error.Password.required" };
  }
  if (!values.message) {
    errors.message = { id: "LogInForm.Error.Password.required" };
  }

  return errors;
};
let initialValues = { name: "", email: "",  message: "" };

function ContactUs({ addAlertMessage }) {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [focused, setFocused] = useState({});
  const onSubmit = async (
    { email, name,  message },
    { setSubmitting, resetForm }
  ) => {
    setSubmitting(false);
    await http({
      method: "POST",
      app: "user",
      path: "contacts",
      data: {
        email,
        name,
        message
      }
    });
    addAlertMessage({
      type: "success",
      message: { id: "ContactUs.Alert.Success" }
    });
    resetForm({});
  };
  if(currentUser){
    initialValues.name = currentUser.name;
    initialValues.email = currentUser.email;
  }
  const displayNone = currentUser?true:false;
  const handleFocus = event => {
    const { name } = event.target;
    setFocused({
      [name]: true
    });
  };

  return (
    <section className="section-contact-us" id="section-contact-us">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-1"></div>
          <div className="col-12 col-md-10 contact-us mt-5 mb-5">
            <h2 className="text-center mb-4">Contáctanos para cualquier consulta</h2>
            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={onSubmit}
              render={({ errors, isValid, touched, values }) => (
                <Form className="auth-form">
                  <FormGroup
                    name="name"
                    label={"Nombre"}
                    focused={focused.name}
                    touched={touched.name}
                    valid={Boolean(values.name && !errors.name)}
                    display={displayNone}
                  >
                    <Field
                      id="name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      onFocus={handleFocus}
                    />
                  </FormGroup>
                  <FormGroup
                    name="email"
                    label={"Correo"}
                    focused={focused.email}
                    touched={touched.email}
                    valid={Boolean(values.email && !errors.email)}
                    display={displayNone}
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
                    name="message"
                    label={"Mensaje"}
                    focused={focused.message}
                    touched={touched.message}
                    valid={Boolean(values.message && !errors.message)}
                  >
                    <Field
                      id="message"
                      name="message"
                      as="textarea"
                      autoComplete="message"
                      rows="10"
                      onFocus={handleFocus}
                    />
                  </FormGroup>

                  <Button
                    type="submit"
                    block
                    disabled={!isValid}
                    className="fs-btn"
                  >
                    Enviar
                  </Button>
                </Form>
              )}
            />
            <div className="left-background">
            </div>
            <div className="right-background">
            </div>
          </div>
          <div className="col-12 col-md-1"></div>
        </div>
      </div>
    </section>
  );
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
  addAlertMessage
};

const SectionContactUs = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactUs);
export default SectionContactUs;
