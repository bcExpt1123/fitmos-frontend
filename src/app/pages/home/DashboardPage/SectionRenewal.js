import React,{useState,useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { http } from "../services/api";
import { reactivateSubscription } from "../../home/redux/checkout/actions";

const SectionRenewal = ({show,handleClose}) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const selectEl = useRef(null);
  const [nextWorkoutPlan, setNextWorkoutPlan] = useState(currentUser.customer.nextWorkoutPlan);
  const handleChange = ()=>{
    setNextWorkoutPlan(selectEl.current.value);
  }
  const dispatch = useDispatch();
  const submit = ()=>{
    dispatch(reactivateSubscription({frequency:nextWorkoutPlan}));
    handleClose();
  }
  const handleHide = ()=>{
    handleClose();
  }
  return (
    <Modal
      size="md"
      show={show}
      dialogClassName="renewal-subscription"
      onHide={handleHide}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Renovación de membresía
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Membresía actual: &nbsp;{currentUser.customer.currentWorkoutPlanPeriod}</p>
        <p>Próxima renovación:&nbsp;{currentUser.customer.renewalOptions&&currentUser.customer.renewalOptions.text[nextWorkoutPlan]}</p>
        <p>Editar próxima suscripción:</p>
        <Form>
          <Form.Group>
            <Form.Control
              as="select"
              defaultValue={nextWorkoutPlan}
              onChange={handleChange}
              ref={selectEl}
            >
              {currentUser.customer.renewalOptions&&currentUser.customer.renewalOptions.price.map((item, index)=>
                <option value={item.frequency} key={index}>{item.label}</option>
              )}
            </Form.Control>
          </Form.Group>
          <Button
            type="button"
            onClick={submit}
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

export default SectionRenewal;
