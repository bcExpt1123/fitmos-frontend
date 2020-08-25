import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import {Row,Col} from "react-bootstrap";
import {Button} from "react-bootstrap";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import Avatar from "../../components/Avatar";
import Icon from "../../components/Icon";
import FormGroup from "../../components/FormGroup";
import { updateProfile } from "../../redux/userSettings/actions";

const validate = withPassword => ({
  email,
  first_name,
  last_name,
  password,
  confirm_password
}) => {
  const errors = {};

  // Email
  if (!email) {
    errors.email = { id: "LogInForm.Error.Email.required" };
  } else if (!/.+@.+/.test(email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }
  if (!first_name) {
    errors.first_name = { id: "SettingsForm.Profile.Error.FirstName.required" };
  }
  if (!last_name) {
    errors.last_name = { id: "SettingsForm.Profile.Error.LastName.required" };
  }
  // Password
  if (password !== confirm_password) {
    errors.confirm_password = {
      id: "LogInForm.Error.Password.required"
    };
  }
  /*if (withPassword && (password || confirm_password) && !currentPassword) {
    errors.currentPassword = {
      id: 'LogInForm.Error.Password.required',
    };
  }*/

  if (Object.keys(errors).length) {
    return errors;
  }

  return undefined;
};

const EditProfile = ({ updateProfile, currentUser }) => {
  const [focused, setFocused] = useState({});
  const [file, setFile] = useState(false);
  const [images, setImages] = useState(false);
  // this is used to disable Google/FB disconnect buttons if Google/FB is the only
  // auth type for user.

  const onSubmit = (
    {
      first_name,
      last_name,
      email,
      customer_email,
      password,
      confirm_password,
      active_email,
      active_whatsapp,
      whatsapp_phone_number,
      country,
      country_code
    },
    { setSubmitting, setErrors, setFieldValue }
  ) => {
    let params = {
      first_name,
      last_name,
      email,
      customer_email,
      active_email,
      active_whatsapp,
      whatsapp_phone_number,
      country,
      country_code
    };
    if (password) {
      params.password = password;
      params.confirm_password = confirm_password;
    }
    if (images) params.image = images;
    return new Promise((resolve, reject) => {
        updateProfile({
          params,
          resolve,
          reject
        });
      })
      .then(() => {
        setFieldValue("password", "");
        setFieldValue("confirm_password", "");
        setTimeout(function(){setFile(false)},500);
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
    <>
      <Formik
        initialValues={{
          active_email: currentUser.customer.active_email,
          active_whatsapp: currentUser.customer.active_whatsapp,
          email: currentUser.email,
          customer_email: currentUser.customer.email,
          whatsapp_phone_number: currentUser.customer.whatsapp_phone_number
            ? currentUser.customer.whatsapp_phone_number
            : "",
          first_name: currentUser.customer.first_name,
          last_name: currentUser.customer.last_name,
          password: "",
          confirm_password: "",
          country:currentUser.customer.country,
          country_code:currentUser.customer.country_code,
        }}
        validate={validate(currentUser.password)}
        onSubmit={onSubmit}
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
            <Form className="auth-form">
              <Row>
                <Col xs={12} md={6}>
                  <Row>
                    <Col xs={12} md={2}></Col>
                    <Col xs={12} md={8}>
                      <Avatar
                        pictureUrls={currentUser.avatarUrls}
                        size="xl"
                        className={"userAvatar"}
                        changeImage={file}
                      >
                        <div className={"userAvatarUpload"}>
                          <Icon name="camera" />
                          <FormattedMessage id="SettingsPage.Profile.AvatarUpload.text" />
                          <input
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={({ target: { files } }) => {
                              if (files[0]) {
                                const file = URL.createObjectURL(files[0]);
                                setImages(files);
                                setFile(file);
                              }
                            }}
                          />
                        </div>
                      </Avatar>
                      <FormGroup
                        hasValue={Boolean(values.first_name)}
                        name="first_name"
                        htmlFor="first_name"
                        label={"Nombre"}
                        focused={focused.first_name}
                        touched={touched.first_name}
                        valid={Boolean(values.first_name && !errors.first_name)}
                      >
                        <Field
                          id="first_name"
                          type="text"
                          name="first_name"
                          autoComplete="given-name"
                          onFocus={handleFocus}
                        />
                      </FormGroup>

                      <FormGroup
                        hasValue={Boolean(values.last_name)}
                        name="last_name"
                        htmlFor="last_name"
                        label={"Apellido"}
                        focused={focused.last_name}
                        touched={touched.last_name}
                        valid={Boolean(values.last_name && !errors.last_name)}
                      >
                        <Field
                          id="last_name"
                          type="text"
                          name="last_name"
                          autoComplete="last_name"
                          onFocus={handleFocus}
                        />
                      </FormGroup>
                      <FormGroup
                        hasValue={Boolean(values.email)}
                        name="email"
                        htmlFor="email"
                        label={"Correo electrónico"}
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
                        hasValue={Boolean(values.password)}
                        name="password"
                        htmlFor="password"
                        label={"Contraseña"}
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
                        label={"Confirmar contraseña"}
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
                    </Col>
                    <Col xs={12} md={2}></Col>
                  </Row>
                </Col>
                <Col xs={12} md={6}>
                  <Row className="mt-5">
                    <Col xs={12} md={10}>
                      <h5 className="text-center mb-4">
                        ¿Cómo deseas recibir tus entrenamientos?
                    </h5>
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
                            hasValue={Boolean(values.customer_email)}
                            name="customer_email"
                            htmlFor="customer_email"
                            label={""}
                            focused={focused.customer_email}
                            touched={touched.customer_email}
                            valid={Boolean(
                              values.customer_email && !errors.customer_email
                            )}
                          >
                            <Field
                              id="customer_email"
                              type="email"
                              name="customer_email"
                              autoComplete="customer_email"
                              onFocus={handleFocus}
                            />
                          </FormGroup>
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
                            masks={{pa: '.... .... ....'}}
                            onFocus={handleFocus}
                            onChange={(phone,country) => {values.whatsapp_phone_number = phone;values.country = country.name;values.country_code=country.countryCode;}}
                          />
                        </Col>
                      </Row>
                      <Button type="submit" className="fs-btn">
                        Actualizar
                      </Button>
                    </Col>
                    <Col xs={12} md={2}></Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}
      </Formik>
    </>
  );
};
const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateProfile
};
const SectionEditProfile = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);

export default SectionEditProfile;
