import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { $create } from "../../../../../modules/subscription/report";
const ReportModal = ({show, type, customer, post, onClose }) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const dispatch = useDispatch();
  useEffect(()=>{
  },[]);
  const handleClose = ()=>{
    onClose();
  }
  const [content, setContent] = useState("");
  const handleContentChange = (evt)=>{
    setContent(evt.target.value);
  }
  const onReportFormSubmit= e => {
    e.preventDefault();
    let id;
    if(post) id=post.id;
    if(customer) id=customer.id;
    dispatch($create(type,id,content));
    setContent("");
    onClose();
  }
  return (
    <Modal
      // dialogClassName="post-modal"
      show={show}
      onHide={handleClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {customer&&
            <>Reporte para {customer.first_name} {customer.last_name}</>
          }
          {post&&
            <>Reporte para Post</>
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onReportFormSubmit} className="report-create">
          <textarea 
            value={content} 
            onChange = {handleContentChange}
            rows={5}
            style={{width:"100%"}}
          />
          <button
            className="btn btn-primary"
            type="submit"
          >
            Enviar
          </button>          
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ReportModal;