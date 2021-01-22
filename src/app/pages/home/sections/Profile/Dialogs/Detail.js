import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { connect,useSelector,useDispatch } from "react-redux";
import SVG from "react-inlinesvg";
import {Modal, Button, Row, Col } from "react-bootstrap";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import es from 'react-phone-input-2/lang/es.json';
import classNames from 'classnames';
import FormGroup from "../../../components/FormGroup";
import { updateProfile, uploadProfileImage } from "../../../redux/userSettings/actions";
import Avatar from "../../../components/Avatar";
import { toAbsoluteUrl } from "../../../../../../_metronic/utils/utils";
import ProfileOverlay from "./ProfileOverlay";
import EditWeight from "../../../profile/EditWeight";

const validate = withPassword => ({
  email,
  first_name,
  last_name,
  password,
  confirm_password
}) => {
  const errors = {};

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

const EditProfile = ({ show, handleClose }) => {
  const countries = []
  Object.keys(es).forEach(key => countries.push({name: key, value: es[key]}));
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const isProfileImageLoading = useSelector(({ done }) => done.isProfileImageLoading);
  const [focused, setFocused] = useState({});
  const [uploadImage,setUploadImage] = useState(false);
  const dispatch = useDispatch();    
  const onSubmit = (
    {
      first_name,
      last_name,
      whatsapp_phone_number,
      current_height,
      country,
      country_code,
      gender,
      description
    },
    { setSubmitting, setErrors, setFieldValue }
  ) => {
    country = es[country_code];
    let params = {
      first_name,
      last_name,
      whatsapp_phone_number,
      current_height,
      country,
      country_code,
      gender,
      description
    };
    return new Promise((resolve, reject) => {
        dispatch(updateProfile({
          params,
          resolve,
          reject
        }));
      })
      .then(() => {
        setTimeout(handleClose,20);
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
  const onUpload = (cropper) => {
    cropper.getCroppedCanvas().toBlob((blob) => {
      const cropedImage = new File([blob], "image");
      const params = {
        image:cropedImage
      }
      dispatch(uploadProfileImage(params));
    });
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      size="lg"
      className={classNames("profile-edit",{upload:uploadImage})}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Perfil
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            whatsapp_phone_number: currentUser.customer.whatsapp_phone_number
              ? currentUser.customer.whatsapp_phone_number
              : "",
            first_name: currentUser.customer.first_name,
            last_name: currentUser.customer.last_name,
            current_height:currentUser.customer.current_height,
            country:currentUser.customer.country,
            country_code:currentUser.customer.country_code,
            gender:currentUser.customer.gender,
            description:currentUser.customer.description
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
                <Col xs={12}>
                  <Avatar
                    pictureUrls={currentUser.avatarUrls}
                    size="xl"
                    className={"userAvatar"}
                  >
                    <div className={"userAvatarUpload"}>
                      <ProfileOverlay url={currentUser.avatarUrls.max} setUploadImage={setUploadImage} onUpload={onUpload} avatar={currentUser.avatar}/>
                    </div>
                    {isProfileImageLoading&&(
                      <div className="loading">
                        <SVG src={toAbsoluteUrl("/media/icons/svg/Code/Loading.svg")} />
                      </div>
                    )}
                  </Avatar>
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
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
                </Col>
                <Col xs={6}>
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
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <FormGroup
                    hasValue={Boolean(values.current_height)}
                    name="current_height"
                    htmlFor="current_height"
                    label={"Altura"}
                    focused={focused.current_height}
                    touched={touched.current_height}
                    valid={Boolean(values.current_height && !errors.current_height)}
                  >
                    <Field
                      id="current_height"
                      type="text"
                      name="current_height"
                      autoComplete="current_height"
                      onFocus={handleFocus}
                    />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup
                    hasValue={Boolean(values.country_code)}
                    name="country_code"
                    htmlFor="country_code"
                    label={"País"}
                    focused={focused.country_code}
                    touched={touched.country_code}
                    valid={Boolean(values.country_code && !errors.country_code)}
                  >
                    <Field 
                      as="select" 
                      name="country_code"
                      id="country_code"
                      autoComplete="country_code"
                      onFocus={handleFocus}
                    >
                      {
                        countries.map(country=>(
                          <option value={country.name} key={country.name}>{country.value}</option>
                        ))
                      }
                    </Field>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={6} className="">
                  <FormGroup
                    hasValue={Boolean(values.gender)}
                    name="gender"
                    htmlFor="gender"
                    label={"Género"}
                    focused={focused.gender}
                    touched={touched.gender}
                    valid={Boolean(values.gender && !errors.gender)}
                  >
                    <Field
                      id="gender"
                      as="select"
                      name="gender"
                      autoComplete="gender"
                      onFocus={handleFocus}
                    >
                      <option value="Male">Masculino</option>
                      <option value="Female">Femenino</option>
                    </Field>  
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <PhoneInput
                    country={values.country_code}
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
              <Row>
                <Col xs={12} className="description">
                  <FormGroup
                    hasValue={Boolean(values.description)}
                    name="description"
                    htmlFor="description"
                    label={"Description"}
                    focused={focused.description}
                    touched={touched.description}
                    valid={Boolean(values.description && !errors.description)}
                  >
                    <Field
                      id="description"
                      type="text"
                      name="description"
                      as="textarea"
                      rows="5"
                      autoComplete="description"
                      onFocus={handleFocus}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Button type="submit" className="fs-btn">
                    Actualizar
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <EditWeight />
      </Modal.Body>
    </Modal>
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
