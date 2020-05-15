import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field } from "formik";
import FormGroup from "../components/FormGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { http } from "../services/api";
import QuickStatsChart from "../../../widgets/QuickStatsChart";
import { $updatePublishedResult } from "../../../../modules/subscription/benchmark";
registerLocale("es", es);
const validate = values => {
  const errors = {};
  if (!values.repetition) {
    errors.repetition = {
      id: "LogInForm.Error.Email.required"
    };
  }
  if (!values.recording_date) {
    errors.recording_date = {
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
class EditBenchmark extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // form input fields states
      focused: {},
      id: null,
      repetition: "",
      recording_date: new Date(),
      benchmarks: []
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.removeBenchmark = this.removeBenchmark.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = date => {
    this.setState({
      recording_date: date
    });
  };
  handleShow() {
    const result = this.getBenchmarks();
  }
  async getBenchmarks() {
    const res = await http({
      method: "GET",
      app: "user",
      path: "benchmarkResults/" + this.props.benchmark.id + "/benchmark"
    });
    let { data } = res;
    this.setState({ benchmarks: data.published });
  }
  onSubmit = async ({ repetition }, { setSubmitting }) => {
    let res;
    if (this.state.id) {
      res = await http({
        method: "PUT",
        app: "user",
        path: "benchmarkResults/" + this.state.id,
        data: {
          recording_date: formatDate(this.state.recording_date),
          repetition,
          id: this.state.id
        }
      });
    } else {
      res = await http({
        method: "POST",
        app: "user",
        path: "benchmarkResults",
        data: {
          recording_date: formatDate(this.state.recording_date),
          repetition,
          benchmark_id: this.props.benchmark.id
        }
      });
    }
    let { data } = res;
    this.setState({ benchmarks: data.published });
    setSubmitting(false);
    this.setState({ id: null, repetition: 0, recording_date: new Date() });
    this.setState({ repetition: "" });
    if (data.published[0])
      this.props.$updatePublishedResult({
        id: data.published[0].benchmark_id,
        repetition: data.published[0].repetition
      });
  };
  handleFocus(event) {
    const { name } = event.target;
    this.setState({
      focused: {
        [name]: true
      }
    });
  }
  async removeBenchmark(id) {
    const res = await http({
      method: "DELETE",
      app: "user",
      path: "benchmarkResults/" + id,
      data: {
        id
      }
    });
    let { data } = res;
    this.setState({ benchmarks: data.published });
    if (data.published[0])
      this.props.$updatePublishedResult({
        id: data.published[0].benchmark_id,
        repetition: data.published[0].repetition
      });
  }
  editBenchmark(id, repetition, recording_date) {
    this.setState({ id, repetition, recording_date: new Date(recording_date) });
  }
  render() {
    let chartOptions;
    if(this.props.results.histories && this.props.results.histories[this.props.benchmark.id]){
      chartOptions = {
        data: this.props.results.histories[this.props.benchmark.id].data,
        color: "#bbca43",
        labels: this.props.results.histories[this.props.benchmark.id].labels,
        border: 3
      };  
    }
    return (
      <Modal
        size="lg"
        show={this.props.show}
        onHide={this.props.handleClose}
        animation={false}
        centered
        onShow={this.handleShow}
        className="edit-benchbark"
      >
        <Modal.Header closeButton>
          <Modal.Title className="">{this.props.benchmark.title}</Modal.Title>
          <div className="sub-title">
            Tiempo {this.props.benchmark.time} minutos
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-5">
            <div className="mb-4 col-12 col-md-8" style={{ whiteSpace: "pre-line" }}>
              {this.props.benchmark.description}
            </div>
            <div className="col-12 col-md-4">
              {chartOptions&&chartOptions.data&&(
                  <QuickStatsChart
                    data={chartOptions.data}
                    labels={chartOptions.labels}
                    color={chartOptions.color}
                    border={chartOptions.border}
                  />
                )
              }
            </div>
          </div>
          <Formik
            enableReinitialize
            validate={validate}
            onSubmit={this.onSubmit}
            initialValues={{
              repetition: this.state.repetition,
              recording_date: this.state.recording_date
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
                      hasValue={Boolean(values.repetition)}
                      name="repetition"
                      htmlFor="benchmark"
                      label={"repeticiones"}
                      focused={this.state.focused.repetition}
                      touched={touched.repetition}
                      valid={Boolean(values.repetition && !errors.repetition)}
                    >
                      <Field
                        id="repetition"
                        type="number"
                        name="repetition"
                        autoComplete="given-name"
                        onFocus={this.handleFocus}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={12} md={4}>
                    <FormGroup
                      hasValue={true}
                      name="recording_date"
                      htmlFor="recording_date"
                      label={""}
                      valid={true}
                    >
                      <DatePicker
                        locale="es"
                        id="recording_date"
                        name="recording_date"
                        autoComplete="recording_date"
                        selected={this.state.recording_date}
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
                <th>Repetición</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.benchmarks && this.state.benchmarks.length ? (
                this.state.benchmarks.map(
                  ({
                    id,
                    repetition,
                    recording_date,
                    recording_date_format
                  }) => (
                    <tr key={id}>
                      <td>{recording_date_format}</td>
                      <td>{repetition}</td>
                      <td>
                        <Button
                          variant="light"
                          className="transparent-btn"
                          onClick={() => this.removeBenchmark(id)}
                        >
                          <i className="fa fa-trash"></i>
                        </Button>
                        <Button
                          variant="light"
                          className="transparent-btn"
                          onClick={() =>
                            this.editBenchmark(id, repetition, recording_date)
                          }
                        >
                          <i className="fa fa-edit"></i>
                        </Button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="4">Sin datos</td>
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
  currentUser: state.auth.currentUser,
  results:state.benchmark.results,
});

const mapDispatchToProps = {
  $updatePublishedResult
};
const SectionEditBenchmark = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBenchmark);
export default SectionEditBenchmark;
