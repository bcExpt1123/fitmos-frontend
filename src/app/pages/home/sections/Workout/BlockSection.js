import React, { useState, useEffect } from "react";
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";

const BlockSection = ({ block, renderLine, index })=>{
  const [open, setOpen] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Ver notas");
  useEffect(()=>{
    //if(open)setButtonLabel("Cerrar notas");
    //else setButtonLabel("Ver notas");
  },[open]);
  const handleHide = ()=>{
    setOpen(false);
  }
  return (
    <>
      {block.image_path&&(
        <div className="image">
          <div className="background-container">
              <div className="background" 
                style={{
                  backgroundImage: "url(" + block.image_path + ")"
                }}
              >
              </div>
          </div>
        </div>                          
      )}
      {block.content&&block.content.map( (render,index1)=>(
        renderLine(render, index1)
      ))}
      {block.note&&(
        <>
          <Button
            onClick={() => {setOpen(true)}}
            className="view-notes"
            aria-controls={`block-note-text${index}`}
            aria-expanded={open}
          >
            {buttonLabel}
          </Button>
          {false&&<Collapse in={open}>
              <div id={`block-note-text${index}`}>
                {block.note.map( (render,index1)=>(
                  renderLine(render, index1)
                ))}
              </div>
            </Collapse>
          }
        </>
      )}
      <Modal
        show={open}
        onHide={handleHide}
        animation={false}
        className="instagram-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {block.note&&(
            <div style={{padding:"10px"}}>
              {block.note.map( (render,index1)=>(
                renderLine(render, index1)
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
)}
export default BlockSection;
