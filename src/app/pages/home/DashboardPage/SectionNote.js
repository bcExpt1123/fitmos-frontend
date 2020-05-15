import React,{useState} from "react";
import Modal from "react-bootstrap/Modal";
import { Markup } from "interweave";

const SectionNote = ({line}) => {
  const [show,setShow] = useState(false);
  const handleHide = ()=> {
    setShow(false);
  }
  return (
    <p>{line.before_content}&nbsp;<button onClick={()=>setShow(true)}>{line.title}</button>{line.after_content}
      <Modal
        size="md"
        show={show}
        onHide={handleHide}
        animation={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            {line.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{whiteSpace:'pre-wrap'}}>
          <Markup content={line.body} />
        </Modal.Body>
      </Modal>
    </p>
  );
};
export default SectionNote;
