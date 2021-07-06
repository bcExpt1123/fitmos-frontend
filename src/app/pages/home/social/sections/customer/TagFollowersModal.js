import React from "react";
import { Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Avatar from "../../../components/Avatar";

const TagFollowersModal = ({show, followers, onClose }) => {
  const customers = followers.filter((follower, index)=>{
    if(index>0) return follower;
  })
  return (
    <Modal
      // dialogClassName="post-modal"
      show={show}
      onHide={onClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Personas
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {customers.map(customer=><NavLink to={"/" + customer.username} key={customer.id} className="tag-follower">
          <div className="avatar">
            <Avatar
              pictureUrls={customer.avatarUrls}
              size="xs"
              className={"userAvatar"}
            />
          </div>
          <div className="info">
            <div>{customer.first_name} {customer.last_name}</div>
            <div className="username">{customer.username}</div>
          </div>
          {/* <div className="message">
            <button className="btn btn-primary">Message</button>
          </div> */}
        </NavLink>)}
      </Modal.Body>
    </Modal>
  );
}

export default TagFollowersModal;