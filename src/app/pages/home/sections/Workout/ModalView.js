import React, { useState, useEffect } from "react";
import {  useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Button, Modal } from "react-bootstrap";
import ModalBlock from "./ModalBlock";
import VideoView from "./VideoView";
import SectionNote from '../../DashboardPage/SectionNote';
import Icon from "../../components/Icon";
import { convertContent,convertVideo,convertIntroduction, setVideo } from "../../redux/workout/actions";

const ModalView = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const workouts = useSelector(({done})=>done.workouts);
  const step = useSelector(({workout})=>workout.step);
  const view = useSelector(({workout})=>workout.view);
  const video = useSelector(({workout})=>workout.video);
  const renderLine = (line,index)=>{
    switch(line.tag){
      case 'h1':
        return <h1 key={index}>{line.content}</h1>;
      case 'h2':
        return <h2 key={index}>{line.content}</h2>;
      case 'modal':
        return <SectionNote key={index} line={line} />;
      case 'p':
        return <p key={index}>
          {line.before_content}&nbsp;
          {line.video&&(
            <button onClick={()=>{
                dispatch(convertVideo());
                dispatch(setVideo(line.video));
              }
            }>
              {line.video.name}
            </button>
          )}          
          {line.after_content}
          </p>;
      default:
    }
  }
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      animation={false}
      className={classnames({"workouts-modal":true, video:(view==='video' || view==='instruction'), trans:(view==='video')})}
      centered
      size="lg"
      backdrop="static"
    >
      {view==='content'?
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            Workout {
              workouts&&workouts.current&&(
                workouts.current.short_date
              )
            }
          </Modal.Title>
        </Modal.Header>
        :
        <Modal.Header>
          {view==='video'&&(
            <button type="button" className={"back-button"} onClick={() => { dispatch(convertContent())}}>
              <Icon name="arrowLeft" className="arrow-left" />
            </button>              
          )}
          {view==='instruction'&&(
            <button type="button" className={"back-button"} onClick={() => { dispatch(convertVideo())}}>
              <Icon name="arrowLeft" className="arrow-left" />
            </button>              
          )}
          <Modal.Title className="text-center w-100"> 
            {view==='video'&&(
              video.name
            )}
            {view==='instruction'&&(
              <>Instrucciones</>
            )}
          </Modal.Title>
          {view==='video'&&(
            <button type="button" className={"back-button help"} onClick={() => { dispatch(convertIntroduction())}}>
              Instrucciones
            </button>              
          )}
      </Modal.Header>
      }
      <Modal.Body>
        <div className={classnames({'d-none':view!=='content'})}>{
          workouts&&workouts.current.blocks.map((block, index) => (
            step!==0 && step === index && (
              <ModalBlock key={index}
                block={block}
                renderLine={renderLine}
              />
            )
          )
          )
        }
        </div>
        {view==='video'&&
          <VideoView />
        }
        {view==='instruction'&&
          <>
            {video.instruction}
          </>
        }
      </Modal.Body>
    </Modal>
  );
}

export default ModalView;