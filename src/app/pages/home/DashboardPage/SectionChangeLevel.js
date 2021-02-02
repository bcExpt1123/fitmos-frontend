import React from "react";
import { connect } from "react-redux";
import {Button, Modal, Form } from "react-bootstrap";
import { http } from "../services/api";
import { updateCustomerAttribute as updateConditionAction } from "../../home/redux/auth/actions";
import { $resetPublished } from "../../../../modules/subscription/benchmark";

class ChangeLevel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // form input fields states
      conditions: [],
      condition: this.props.currentUser.customer.current_condition
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    //        console.log(this.selectEl.value)
    this.setState({ condition: this.selectEl.value });
  }
  componentDidMount() {
    this.getConditions();
  }
  async getConditions() {
    try {
      const res = await http({
        method: "GET",
        app: "user",
        path: "customers/conditions"
      });
      const { data } = res;
      this.setState({ conditions: data });
    } catch (e) {
      console.log(e);
    }
  }
  handleLevel = async () => {
    await http({
      method: "POST",
      app: "user",
      path: "customers/changeCondition",
      data: {
        condition: this.state.condition
      }
    });
    this.props.updateConditionAction({
      attribute: "current_condition",
      value: this.state.condition
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
        onHide={this.props.handleClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            Elige tu nivel
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group style={{ width: "50px", margin: "0 auto" }}>
              <Form.Control
                as="select"
                defaultValue={this.state.condition}
                onChange={this.handleChange}
                ref={el => (this.selectEl = el)}
              >
                {this.state.conditions.map(condition => (
                  <option key={condition.id} value={condition.id}>
                    {condition.id}
                  </option>
                ))}
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
const SectionChangeLevel = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeLevel);
export default SectionChangeLevel;
