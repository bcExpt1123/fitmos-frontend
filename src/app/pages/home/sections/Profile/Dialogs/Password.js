import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field } from "formik";
import { useDispatch } from "react-redux";
import FormGroup from "../../../components/FormGroup";
import { updatePassword } from "../../../redux/userSettings/actions";

const validate = ({password, confirm_password}) => {
  const errors = {};
  // Password
  if (password !== confirm_password) {
    errors.confirm_password = {
      id: "LogInForm.Error.Password.required"
    };
  }
  return errors;
};

const UpdatePassword = ({show,handleClose}) => {
  const [focused, setFocused] = useState({});
  const handleFocus = event => {
    const { name } = event.target;
    setFocused({
      [name]: true
    });
  };
  const dispatch = useDispatch();
  const onSubmit = (
    { email },
    { setSubmitting, setErrors, setFieldValue }
  ) => {
    let params = {
      email,
    };
    return new Promise((resolve, reject) => {
      dispatch(updatePassword({
        params,
        resolve,
        reject
      }));
    })
      .then(() => { handleClose() })
      .catch(errors => {
        setErrors(errors);
      })
      .finally(() => setSubmitting(false));
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      className="subscriptions"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Contraseña
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validate={validate}
          onSubmit={onSubmit}
          initialValues={{
            password: "",
            confirm_password: "",
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
              <Button type="submit" className="fs-btn">
                Actualizar
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default UpdatePassword;
