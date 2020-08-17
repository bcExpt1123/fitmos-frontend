import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field } from "formik";
import { useSelector, useDispatch } from "react-redux";
import FormGroup from "../../../components/FormGroup";
import { updateOnlyEmail } from "../../../redux/userSettings/actions";

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = {
      id: "LogInForm.Error.Email.required"
    };
  }else if (!/.+@.+/.test(values.email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }
  return errors;
};

const UpdateEmail = ({show,handleClose}) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
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
      dispatch(updateOnlyEmail({
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
          Email
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validate={validate}
          onSubmit={onSubmit}
          initialValues={{
            email: currentUser.customer.email,
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

export default UpdateEmail;
