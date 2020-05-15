import React, { useState } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import FormGroup from "../components/FormGroup";
import { updateEmail } from "../redux/userSettings/actions";

const validate = values => {
  const errors = {};

  // Email
  if (!values.email) {
    errors.email = { id: "LogInForm.Error.Email.required" };
  } else if (!/.+@.+/.test(values.email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }

  return errors;
};

const Email = ({ currentUser, updateEmail }) => {
  const [focused, setFocused] = useState({});
  const handleFocus = event => {
    const { name } = event.target;
    setFocused({
      [name]: true
    });
  };
  const onSubmit = (
    { email, active_email, active_whatsapp, whatsapp_phone_number,country,country_code },
    { setSubmitting, setErrors, setFieldValue }
  ) => {
    let params = {
      email,
      active_email: active_email ? 1 : 0,
      active_whatsapp: active_whatsapp ? 1 : 0,
      whatsapp_phone_number,
      country,
      country_code,
    };
    return new Promise((resolve, reject) => {
      updateEmail({
        params,
        resolve,
        reject
      });
    })
      .then(() => { })
      .catch(errors => {
        setErrors(errors);
      })
      .finally(() => setSubmitting(false));
  };
  return (
    <Card className="email">
      <Card.Body>
        <Card.Title className="text-center mb-5">
          ¡Felicidades{" "}
          <span style={{ textTransform: "capitalize" }}>
            {currentUser.customer.first_name}
          </span>
          ! Ya eres parte de la gran familia Fitemos
        </Card.Title>
        <Card.Text>
          <span style={{ textTransform: "capitalize" }}>
            {currentUser.customer.first_name}
          </span>
          , te hemos enviado un correo de suma importancia. El mismo habla sobre
          las generalidades de Fitemos, los equipos a utilizar y que esperar del
          entrenamiento.
        </Card.Text>
        <Card.Subtitle className="text-center mt-5 mb-5">
          ¿Cómo deseas recibir tus entrenamientos?
        </Card.Subtitle>
        <Formik
          validate={validate}
          onSubmit={onSubmit}
          initialValues={{
            active_email: currentUser.customer.active_email,
            active_whatsapp: currentUser.customer.active_whatsapp,
            email: currentUser.customer.email,
            whatsapp_phone_number: currentUser.customer.whatsapp_phone_number
              ? currentUser.customer.whatsapp_phone_number
              : "",
            country:currentUser.customer.country,
            country_code:currentUser.customer.country_code,  
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors
          }) => (
              <Form noValidate onSubmit={handleSubmit} className="auth-form">
                <Row>
                  <Col xs={12} md={10}>
                    <Row className="email-whatsapp">
                      <Col xs={12} md={4}>
                        <Field
                          id="active_email"
                          type="checkbox"
                          name="active_email"
                          autoComplete="active_email"
                          onFocus={handleFocus}
                        />
                        <label htmlFor="active_email">E-mail</label>
                      </Col>
                      <Col xs={12} md={8}>
                        <FormGroup
                          hasValue={Boolean(values.email)}
                          name="email"
                          htmlFor="email"
                          label={""}
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
                        <div className="description">
                          Correo para recibir los entrenamientos
                      </div>
                      </Col>
                    </Row>
                    <Row className="email-whatsapp">
                      <Col xs={12} md={4}>
                        <Field
                          id="active_whatsapp"
                          type="checkbox"
                          name="active_whatsapp"
                          autoComplete="active_whatsapp"
                          onFocus={handleFocus}
                        />
                        <label htmlFor="active_whatsapp">WhatsApp</label>
                      </Col>
                      <Col xs={12} md={8}>
                        <PhoneInput
                          country={currentUser.customer.country_code}
                          localization={es}
                          id="whatsapp_phone_number"
                          type="text"
                          name="whatsapp_phone_number"
                          value={values.whatsapp_phone_number}
                          onFocus={handleFocus}
                          onChange={(phone,country) => {values.whatsapp_phone_number = phone;values.country = country.name;values.country_code=country.countryCode;}}
                        />
                        <div className="description">
                          Pronto podrás recibir tus Rutinas por Whatsapp
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Card.Subtitle className="text-center mt-5 mb-5">
                  Podrás editar este detalle en tu perfil
              </Card.Subtitle>
                <Button type="submit" className="fs-btn">
                  Guardar Ajustes
              </Button>
              </Form>
            )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateEmail
};
const SectionEmail = connect(mapStateToProps, mapDispatchToProps)(Email);
export default SectionEmail;
