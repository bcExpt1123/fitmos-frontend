import React from "react";
import { connect } from "react-redux";
import {Button} from "react-bootstrap";
import {Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import FormGroup from "../components/FormGroup";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";
import {Table} from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { http } from "../services/api";
import {
  updateWeight as updateWeightAction,
  deleteAuthData as deleteAuthAction
} from "../../home/redux/auth/actions";
registerLocale("es", es);
const validate = values => {
  const errors = {};
  if (!values.weight) {
    errors.weight = {
      id: "LogInForm.Error.Email.required"
    };
  }
  if (!values.date) {
    errors.date = {
      id: "LogInForm.Error.Email.required"
    };
  }

  return errors;
};
const formatDate = date => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
class EditWeight extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // form input fields states
      focused: {},
      id: null,
      size: "",
      date: new Date(),
      weights: []
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.removeWeight = this.removeWeight.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = date => {
    this.setState({
      date: date
    });
  };
  componentDidMount() {
    this.getWeights();
  }
  async getWeights() {
    const environment = process.env.NODE_ENV;
    console.log(environment)
    try {
      const res = await http({
        method: "GET",
        app: "user",
        path: "customers/weights"
      });
      let { data } = res;
      this.setState({ weights: data });
    } catch (e) {
      if (e.response.status === 401) {
        if(environment!=='development')this.props.deleteAuthAction();
      }
      console.log(e);
    }
  }
  onSubmit = async ({ weight }, { setSubmitting }) => {
    let res;
    if (this.state.id) {
      res = await http({
        method: "PUT",
        app: "user",
        path: "customers/weights",
        data: {
          size: weight,
          date: formatDate(this.state.date),
          id: this.state.id
        }
      });
    } else {
      res = await http({
        method: "POST",
        app: "user",
        path: "customers/weights",
        data: {
          size: weight,
          date: formatDate(this.state.date)
        }
      });
    }
    let { data } = res;
    this.setState({ weights: data });
    setSubmitting(false);
    this.setState({ id: null, size: 0, date: new Date() });
    this.setState({ size: "" });
    this.props.updateWeightAction({ weight: data[0].size, imc: data[0].imc });
  };
  handleFocus(event) {
    const { name } = event.target;
    this.setState({
      focused: {
        [name]: true
      }
    });
  }
  async removeWeight(id) {
    const res = await http({
      method: "DELETE",
      app: "user",
      path: "customers/weights",
      data: {
        id
      }
    });
    let { data } = res;
    this.setState({ weights: data });
    if (data[0])
      this.props.updateWeightAction({ weight: data[0].size, imc: data[0].imc });
  }
  editWeight(id, size, date) {
    this.setState({ id, size, date: new Date(date) });
  }
  render() {
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.handleClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            Monitoreo de peso corporal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            Para tener un monitoreo real de tu peso. Debes ser consistente en
            cada medición. Te recomendamos pesarte antes del desayuno sin ropa
            pesada y sin zapatos.
          </div>
          <Formik
            enableReinitialize
            validate={validate}
            onSubmit={this.onSubmit}
            initialValues={{
              weight: this.state.size,
              date: this.state.date
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
              <Form className="auth-form">
                <Row>
                  <Col xs={12} md={4}>
                    <FormGroup
                      hasValue={Boolean(values.weight)}
                      name="weight"
                      htmlFor="weight"
                      label={"Ingrese peso"}
                      focused={this.state.focused.weight}
                      touched={touched.weight}
                      valid={Boolean(values.weight && !errors.weight)}
                    >
                      <Field
                        id="weight"
                        type="number"
                        name="weight"
                        autoComplete="given-name"
                        onFocus={this.handleFocus}
                      />
                      <span>
                        {this.props.currentUser.customer.current_weight_unit}
                      </span>
                    </FormGroup>
                  </Col>
                  <Col xs={12} md={4}>
                    <FormGroup
                      hasValue={Boolean(values.date)}
                      name="date"
                      htmlFor="date"
                      label={""}
                      focused={this.state.focused.date}
                      valid={Boolean(values.date && !errors.date)}
                    >
                      <DatePicker
                        locale="es"
                        id="date"
                        name="date"
                        autoComplete="date"
                        selected={this.state.date}
                        onChange={this.handleChange}
                        placeholderText="Fecha"
                        dateFormat="dd/MM/yyyy"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={12} md={1}></Col>
                  <Col xs={12} md={3}>
                    <Button type="submit" variant="edit">
                      Guardar
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Peso</th>
                <th>IMC</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.weights && this.state.weights.length ? (
                this.state.weights.map(
                  ({ id, size, unit, date, imc, created_at }) => (
                    <tr key={id}>
                      <td>{date}</td>
                      <td>
                        {size}
                        {unit}
                      </td>
                      <td>{imc}</td>
                      <td>
                        <Button
                          variant="light"
                          className="transparent-btn"
                          onClick={() => this.removeWeight(id)}
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
                        <Button
                          variant="light"
                          className="transparent-btn"
                          onClick={() => this.editWeight(id, size, created_at)}
                        >
                          <i className="fa fa-edit"></i>
                        </Button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="4">Sin mancuernas</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

const mapDispatchToProps = {
  updateWeightAction,
  deleteAuthAction
};
const SectionEditWeight = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditWeight);
export default SectionEditWeight;
