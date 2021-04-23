import React from "react";
import { Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import BirthdayCustomer from "./customer/BirthdayCustomer";
import { setItemValue } from "../../redux/post/actions";

const BirthdayCustomersModal = () => {
  const dispatch = useDispatch();
  const birthdayPost = useSelector(({post})=>post.birthdayPost);
  const onClose = ()=>{
    dispatch(setItemValue({name:"birthdayPost", value:null}));
  }
  return (
    birthdayPost&&
    <Modal
      dialogClassName="birthday-customers-modal"
      show={birthdayPost!=null}
      onHide={onClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Cumpleaños
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <div className="birthday-customers">{
            birthdayPost.customers.map(customer=>
              <BirthdayCustomer key={customer.id} customer={customer} post={birthdayPost}/>
            )
          }
          </div>
        }
      </Modal.Body>
    </Modal>
  );
}

export default BirthdayCustomersModal;