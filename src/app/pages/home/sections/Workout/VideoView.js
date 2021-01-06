import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {Rating} from '@material-ui/lab';
import { withStyles } from "@material-ui/core";
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";
import { Modal, Button } from "react-bootstrap";
import { Markup } from "interweave";
import { alternateVideo, convertContent, confirmAlternate } from "../../redux/workout/actions";
import {isMobile, detectswipe} from '../../../../../_metronic/utils/utils';

const StyledRating = withStyles({
  iconFilled: {
    color: 'red',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);
const VideoView = ({onClose}) => {
  const dispatch = useDispatch();
  const video = useSelector(({workout})=>workout.video);
  const originalVideo = useSelector(({workout})=>workout.originalVideo);
  const [instructionShow,setInstructionShow] = useState(false);
  const modalVideo = useSelector(({workout})=>workout.modalVideo);
  const videoRef = useRef();
  const videoLoading = useRef();
  const [wideVideo, setWideVideo] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmAlternateShow, setConfirmAlternateShow] = useState(false);
  const checkPlayed =()=>{
    const { player } = videoRef.current.getState();
    if(player.paused){
      console.log(player)
      setTimeout(checkPlayed,10);
    }else{
      if(isMobile() && !fullScreen){
        const videoDialog1 = document.getElementsByClassName("video-dialog")[0];
        if( videoDialog1&&document.body.requestFullscreen){
          document.body.requestFullscreen();
          setFullScreen(true);
        }
        // else alert("requestFullScreen");
      }
      setLoading(false);
    }
  }
  const onInstructionHide = ()=>{
    setInstructionShow(false);
  }
  const checkLoad = ()=>{
    if(videoRef.current.videoWidth>0){
      // console.log(videoRef.current.videoHeight/videoRef.current.videoWidth)
      if(videoRef.current.videoHeight/videoRef.current.videoWidth >1.25){
        setWideVideo(true);
      }else{
        setWideVideo(false);
      }
      videoRef.current.play();
      setTimeout(checkPlayed,10);
    }else{
      setTimeout(checkLoad,10);
    }
  }
  useEffect(()=>{
    if(videoRef.current){
      setTimeout(checkLoad,10);
    }
  },[video]);
  useEffect(()=>{
    // document.body.style.cssText = "overflow:hidden !important";
    if(isMobile()) {
      const mobileBack = document.getElementsByClassName("modal-backdrop")[0];
      mobileBack.style.backgroundColor = "#1a1a1a";
      if(mobileBack.classList.contains("show"))mobileBack.style.opacity = "1";
      detectswipe('video_modal',swapeMobile);
      const chat = document.getElementById("wabi-floating-button");
      chat.style.zIndex = 0;
    }else{
      const videoDialog = document.getElementsByClassName("video-dialog")[0];
      if(videoDialog)videoDialog.style.width = (window.innerHeight * 9 / 16 ) + "px";
      // videoDialog.style.marginLeft = "auto";
    }
    return ()=>{
      if(isMobile()){
        if(document.exitFullscreen)document.exitFullscreen();
        setFullScreen(false);
        const chat = document.getElementById("wabi-floating-button");
        chat.style.zIndex = 2147483646;
      }
    }
  },[]);
  const changeVideo = (slug)=>{
    setLoading(true);
    dispatch(alternateVideo(slug));
    setTimeout(checkLoad,10);
  }
  const onCloseVideo = ()=>{
    if(modalVideo)dispatch(convertContent());
    else onClose();
  }
  const handleAlernateModal = ()=>{
    if(originalVideo.id == video.id){
      onCloseVideo();
    }else{
      setConfirmAlternateShow(true);
    }
  }
  const swapeMobile = (el,d)=> {
    if(d === 'r'){
      changeVideo('alternate_a');
    }else if(d === 'l'){
      changeVideo('alternate_b')
    }
  }
  return (
    <div  id="video_modal">
      {/* <div className="text-center">
        <StyledRating
          name="customized-color"
          value={video.level}
          readOnly
          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit" />}
        />                    
      </div> */}
      {loading&&(
        isMobile()?
          <div className="video-loading" >
            <div className="video-react-loading-spinner">
            </div>  
          </div>
        :
          <div className="video-loading" style={{width:window.innerHeight * 9 /16 + "px",marginLeft:"auto" }} ref={videoLoading}>
            <div className="video-react-loading-spinner">
            </div>  
          </div>
      )
        
      }
      <div className={'workout-video'}>
        <Player
          ref={videoRef}
          autoPlay
          loop
          src={video.url}
        >
          <LoadingSpinner />
        </Player>      
      </div>
      {(video.alternate_a || video.alternate_b)&&
        <div className="workout-alternate mt-5">
          {video.alternate_a&&
            <button type="button" className={"back-button alternate_a"} onClick={() => changeVideo('alternate_a')}>
              <i className="fas fa-chevron-left" />
            </button>              
          }
          {video.alternate_b&&
            <button type="button" className={"back-button alternate_b"} onClick={() => changeVideo('alternate_b')}>
              <i className="fas fa-chevron-right" />
            </button>              
          }
        </div>
      }
      <div className="actions workout-footer">
        {/* <button type="button" className={"btn back"} onClick={onCloseVideo}>
          Regresar
        </button>            */}
        <button type="button" className={"btn back"} onClick={()=>{setInstructionShow(true)}}>
          Instrucciones
        </button>              
        <button type="button" className={"btn swap"} onClick={handleAlernateModal}>
          Escoger
        </button>              
      </div>
      <Modal
        show={instructionShow}
        onHide={onInstructionHide}
        animation={false}
        className={classnames("instruction-modal")}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 mt-2">
            Instrucciones
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Markup content={video.instruction} />
        </Modal.Body>
      </Modal>   
      <Modal show={confirmAlternateShow}
        centered
        className={classnames("alternate-modal")}>
        <Modal.Dialog>
          <Modal.Body>
            <p>¿Deseas alternar Mov A por Mov B?</p>
          </Modal.Body>

          <Modal.Footer className="actions">
            <Button variant="custom" onClick={() => setConfirmAlternateShow(false)}>No</Button>
            <Button variant="primary" onClick={()=>{dispatch(confirmAlternate());setConfirmAlternateShow(false);onCloseVideo();}}>Si</Button>
          </Modal.Footer>
        </Modal.Dialog>         
      </Modal>
    </div>
  );
}

export default VideoView;