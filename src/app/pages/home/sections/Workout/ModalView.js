import React, { useState, useEffect } from "react";
import {  useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Modal } from "react-bootstrap";
import ModalBlock from "./ModalBlock";
import VideoView from "./VideoView";
import CompleteView from "./CompleteView";
import SectionNote from '../../DashboardPage/SectionNote';
import {isMobile} from '../../../../../_metronic/utils/utils';
import { convertVideo,convertContent, setVideo } from "../../redux/workout/actions";
import { stopRunning } from "../../redux/done/actions";

const ModalView = ({ isOpen, onClose, onOpenPost }) => {
  const dispatch = useDispatch();
  const workouts = useSelector(({done})=>done.workouts);
  const step = useSelector(({workout})=>workout.step);
  const view = useSelector(({workout})=>workout.view);
  const video = useSelector(({workout})=>workout.video);
  const originalVideo = useSelector(({workout})=>workout.originalVideo);
  const modalVideo = useSelector(({workout})=>workout.modalVideo);
  const isRunning = useSelector(({done})=>done.isRunning);
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
  const changeConfirm = ()=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return false;
      dispatch(stopRunning());
    }
    return true;
  }
  const onHide = ()=>{
    if( view==='content' ){
      if( !changeConfirm() ){
        return false;        
      }
    }
    onClose();
    return true;
  }
  useEffect(()=>{
    if(!isMobile() && view!=='video') {
      const dialog = document.getElementsByClassName("modal-dialog")[0];
      if(dialog)dialog.style.width = "auto";
    }
  },[view]);  
  return (
    <>
      <Modal
        show={isOpen}
        onHide={onHide}
        animation={false}
        className={classnames({"workouts-modal":true, video:(view==='video' || view==='instruction'), trans:(view==='video')})}
        centered
        dialogClassName={classnames({"video-dialog":(view==='video')})}
        size="lg"
        backdrop="static"
      >
        {view==='content'?
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100 mt-2">
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
              <>
                {/* <button type="button" className={"back-button"} onClick={() => { dispatch(convertContent())}}>
                  <Icon name="arrowLeft" className="arrow-left" />
                </button>               */}
                <Modal.Title className="w-100"> 
                  {video.name}
                  {originalVideo.id == video.id?
                    <div className={"active"}>
                      Activo
                    </div>
                    :
                    <div className={"active"} style={{backgroundColor:'transparent'}}>
                      &nbsp;
                    </div>
                  }
                </Modal.Title>
                <button type="button" className="close" onClick={() => { if(modalVideo)dispatch(convertContent());  else onClose();}}>
                  <span aria-hidden="true">×</span><span className="sr-only">Close</span>
                </button>                
                {/* <button type="button" className={"back-button help"} onClick={() => { setInstructionShow(true);}}>
                  <i className="fas fa-book"/>
                </button>               */}
              </>
            )}
            {/* {view==='instruction'&&(
              <>
                <button type="button" className={"back-button"} onClick={() => { dispatch(convertVideo())}}>
                  <Icon name="arrowLeft" className="arrow-left" />
                </button>              
                <Modal.Title className="text-center w-100"> 
                  <>Instrucciones</>
                </Modal.Title>
              </>
            )} */}
        </Modal.Header>
        }
        <Modal.Body>
          <div className={classnames({'d-none':view!=='content'})}>{
              (workouts&&workouts.current.blocks)&&workouts.current.blocks.map((block, index) => (
                step!==0 && step === index && (
                  <ModalBlock key={index}
                    block={block}
                    renderLine={renderLine}
                  />
                )
              )
              )
            }
            {workouts && workouts.current.blocks && step!==0 && step === workouts.current.blocks.length&&
              <>
                <CompleteView onClose={onClose} openCreatingPost={onOpenPost}/>
              </> 
            }
          </div>
          {view==='video'&&
            <VideoView onClose={onClose}/>
          }
          {view==='instruction'&&
            <>
              {video.instruction}
            </>
          }
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalView;