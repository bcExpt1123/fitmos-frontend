import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Button, Col } from 'react-bootstrap';
import { http } from "../../services/api";
import { updateUserDetails } from "../../redux/auth/actions";

const FollowingListModal = ({show, onClose}) => {
  const [validated, setValidated] = useState(false);
  const [dumbellsWeight, setDumbellsWeight] = useState('');
  const dispatch = useDispatch();
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  useEffect(()=>{
    setDumbellsWeight(currentUser.customer.dumbells_weight?currentUser.customer.dumbells_weight:'');
  },[currentUser])
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      setValidated(true);
      try{
        const { user } = await http({
          method: "POST",
          app: "user",
          path: "customers/update-dumbells-weight",
          data: {
            weight:dumbellsWeight
          }
        });
        dispatch(updateUserDetails({user}));
        onClose();
      }catch(e){

      }
    }
  }; 
  const onInput = ({target:{value}}) => setDumbellsWeight(value) 
  return (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      className="dumbells-weight"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          Peso de Mancuernas
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Escribe el peso individual de tus mancuernas.</p>
        <Form onSubmit={handleSubmit} noValidate validated={validated} >
          <Form.Row>
            <Form.Group as={Col} md="2">
              <Form.Control 
                required 
                type="number" 
                placeholder="" 
                className="mt-2"
                onChange={onInput}
                value={dumbellsWeight}/>
            </Form.Group>
            <Form.Group as={Col} md="6">            
              <Button variant="primary" type="submit">
                Aceptar
              </Button>
              </Form.Group>  
          </Form.Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default FollowingListModal;
