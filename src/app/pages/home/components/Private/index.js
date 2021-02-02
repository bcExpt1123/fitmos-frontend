import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { reactLocalStorage } from 'reactjs-localstorage';
import { FormattedMessage } from "react-intl";

import Button from "../Button";
import FormGroup from "../FormGroup";
import FacebookButton from "../Auth/FacebookButton";
import GoogleButton from "../Auth/GoogleButton";
import { $subscribe, $subscribeWithFacebook, $subscribeWithGoogle } from "../../../../../modules/subscription/event";
const validate = values => {
  const errors = {};

  // Email
  if (!values.email) {
    errors.email = { id: "SubscriptionForm.Error.Email.required" };
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = { id: "SubscriptionForm.Error.Email.invalid" };
  }

  // Name
  if (!values.name) {
    errors.name = { id: "SubscriptionForm.Error.Name.required" };
  }

  return errors;
};

const PrivateSection = ({ section }) => {
  const [focused, setFocused] = useState({});
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const subscribed = useSelector(({ event }) => event.subscribed);
  const initialValues = { email: "", name: "" };
  const dispatch = useDispatch();
  const onSubmit = ({ email, name }, { setSubmitting }) => {
    dispatch($subscribe(name, email));
    setSubmitting(false);
  };
  const handleFocus = (event) => {
    const { name } = event.target;
    setFocused({
      focused: {
        [name]: true
      }
    });
  }
  const blogSubscribed = reactLocalStorage.get('blogSubscribed');
  return (
    (currentUser || blogSubscribed || subscribed) ? (
      <>{section()}</>
    ) : (
        <div className="blog-page">
          <div className="container">
            <div className="widget">
              <header>
                <h1 className="title mt-4 mb-4">Accede al blog</h1>
                <p className="blog-login">Ten acceso a valiosa información sobre Fitness, Nutrición, Wellness y Motivación</p>
              </header>
              <section className={"social"}>
                <FacebookButton
                  onClick={() =>
                    dispatch($subscribeWithFacebook())
                  }
                >
                  <FormattedMessage id="BlogPage.Button.Facebook" />
                </FacebookButton>
                <GoogleButton
                  disabled={false}
                  onClick={() =>
                    dispatch($subscribeWithGoogle())
                  }
                >
                  <FormattedMessage id="BlogPage.Button.Google" />
                </GoogleButton>
              </section>

              <div className={"divider"}>
                <span>O</span>
              </div>
              <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={onSubmit}
              render={({ errors, isValid, touched, values }) => (
                <Form className="auth-form">
                  <FormGroup
                    hasValue={Boolean(values.name)}
                    name="name"
                    label={"Nombre"}
                    focused={focused.name}
                    touched={touched.name}
                    valid={Boolean(values.name && !errors.name)}
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
                    hasValue={Boolean(values.email)}
                    name="email"
                    label={"Correo"}
                    focused={focused.email}
                    touched={touched.email}
                    valid={Boolean(values.email && !errors.email)}
                  >
                    <Field
                      id="email"
                      type="email"
                      name="email"
                      className=""
                      autoComplete="email"
                      onFocus={handleFocus}
                    />
                  </FormGroup>
                  <Button
                    type="submit"
                    block
                    disabled={!isValid}
                    className="fs-btn"
                  >
                    Acceder
              </Button>
                </Form>
              )}
            />
            </div>
          </div>
        </div>
      )
  );
};

export default PrivateSection;
