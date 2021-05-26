import React, { useState, useEffect } from "react";
import {  useDispatch, useSelector } from "react-redux";
import {Button, Row, Col} from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import FormGroup from "../../components/FormGroup";
import { http } from "../../services/api";
import { convertContent } from "../../redux/workout/actions";
import { findWorkouts } from "../../redux/done/actions";

const validate = values => {
  const errors = {};
  if (!values.content) {
    errors.content = {
      id: "LogInForm.Error.Email.required"
    };
  }

  return errors;
};

const CreateComment = () => {
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const workouts = useSelector(({done})=>done.workouts);
  const dispatch = useDispatch();
  const [focused, setFocused] = useState({});
  const handleFocus = (event)=> {
    const { name } = event.target;
    setFocused({
        [name]: true
      }
    );
  }
  const slug = useSelector(({workout})=>workout.slug);
  const onSubmit = async ({ content, dumbells_weight }, { setSubmitting }) => {
    let type = 'extra';
    if(['sin_content','con_content'].includes(slug)){
      type = 'basic';
    }
    await http({
      method: "POST",
      app: "user",
      path: "workout-comments",
      data: {
        publish_date:workouts.current.today,
        content,
        type,
        dumbells_weight
      }
    });
    setSubmitting(false);
    dispatch(convertContent());
    dispatch(findWorkouts(workouts.current.today));
  };
  return (
    <div  id="create_comment_modal" className="block mt-5">
      <Formik
        enableReinitialize
        validate={validate}
        onSubmit={onSubmit}
        initialValues={{
          content: "",
          dumbells_weight: currentUser.customer.dumbells_weight
        }}
      >
        {({
          values,
          touched,
          errors
        }) => (
          <Form className="auth-form create-comment-workout">
            <Row>
              <Col xs={12} md={12} className="content">
                <FormGroup
                  hasValue={Boolean(values.content)}
                  name="content"
                  htmlFor="content"
                  label={""}
                  focused={focused.content}
                  touched={touched.content}
                  valid={Boolean(values.content && !errors.content)}
                >
                  <Field
                    id="content"
                    name="content"
                    type="text"
                    as="textarea"
                    rows="5"
                    onFocus={handleFocus}
                  />
                </FormGroup>
              </Col>
            </Row>
            {currentUser.customer.weights === 'con pesas' && (
              <Row>
                <Col xs={3} md={3} style={{flex:'0 0 100px'}}>
                  <FormGroup
                    hasValue={Boolean(values.dumbells_weight)}
                    name="dumbells_weight"
                    htmlFor="dumbells_weight"
                    label={""}
                    focused={focused.dumbells_weight}
                    touched={touched.dumbells_weight}
                    valid={Boolean(values.dumbells_weight && !errors.dumbells_weight)}
                  >
                    <Field
                      id="dumbells_weight"
                      name="dumbells_weight"
                      type="number"
                      onFocus={handleFocus}
                    />
                  </FormGroup>
                </Col>
                <Col xs={3} md={3} className="mt-2 pt-1">
                  lbs
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12} md={12}>
                <Button type="submit" variant="primary">
                  Ingresar
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateComment;