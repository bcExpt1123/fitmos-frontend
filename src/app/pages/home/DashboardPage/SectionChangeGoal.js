import React from "react";
import { connect } from "react-redux";
import {Button, Modal, Form} from "react-bootstrap";
import { http } from "../services/api";
import { updateCustomerAttribute as updateConditionAction } from "../../home/redux/auth/actions";
import { $resetPublished } from "../../../../modules/subscription/benchmark";

class ChangeGoal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // form input fields states
      goal: this.props.currentUser.customer.objective
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }
  handleHide(){
    this.props.handleClose();
    this.setState({ goal: this.props.currentUser.customer.objective });
  }
  handleChange() {
    //        console.log(this.selectEl.value)
    this.setState({ goal: this.selectEl.value });
  }
  handleLevel = async () => {
    await http({
      method: "POST",
      app: "user",
      path: "customers/changeObjective",
      data: {
        goal: this.state.goal
      }
    });
    this.props.updateConditionAction({
      attribute: "objective",
      value: this.state.goal
    });
    this.props.$resetPublished();
    this.props.handleClose();
    return false;
  };
  render() {
    return (
      <Modal
        size="md"
        show={this.props.show}
        onHide={this.handleHide}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            Elige tu objetivo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                as="select"
                defaultValue={this.state.goal}
                onChange={this.handleChange}
                ref={el => (this.selectEl = el)}
              >
                <option value="cardio">Perder peso - Quema la grasa corporal</option>
                <option value="fit">Ponerte en forma - Mejora tu condición física </option>
                {this.props.currentUser.customer.gender === "Male" ? (
                  <option value="strong">Ganar musculatura - Desarrolla tus músculos</option>
                ) : (
                  <option value="strong">Tonificar - Define tus músculos</option>
                )}
              </Form.Control>
            </Form.Group>
            <Button
              type="button"
              onClick={this.handleLevel}
              className="fs-btn"
              style={{ margin: "10px auto", fontSize: "17px", width: "auto" }}
            >
              Cambiar
            </Button>
          </Form>
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
  updateConditionAction,
  $resetPublished
};
const SectionChangeGoal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeGoal);
export default SectionChangeGoal;
