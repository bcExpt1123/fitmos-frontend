import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {Rating} from '@material-ui/lab';
import { withStyles } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Brightness1';
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";
import Icon from "../../components/Icon";
import { alternateVideo, convertContent, confirmAlternate } from "../../redux/workout/actions";

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
  const modalVideo = useSelector(({workout})=>workout.modalVideo);
  const videoRef = useRef();
  const [wideVideo, setWideVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkLoad = ()=>{
    if(videoRef.current.videoWidth>0){
      // console.log(videoRef.current.videoHeight/videoRef.current.videoWidth)
      if(videoRef.current.videoHeight/videoRef.current.videoWidth >1.25){
        setWideVideo(true);
      }else{
        setWideVideo(false);
      }
      setLoading(false);
      videoRef.current.play();
    }else{
      setTimeout(checkLoad,10);
    }
  }
  useEffect(()=>{
    if(videoRef.current){
      setTimeout(checkLoad,10);
    }
  },[video]);
  const changeVideo = (slug)=>{
    setLoading(true);
    dispatch(alternateVideo(slug));
    setTimeout(checkLoad,10);
  }
  const onCloseVideo = ()=>{
    if(modalVideo)dispatch(convertContent());
    else onClose();
  }
  return (
    <>
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
      {loading&&
        <div className="video-loading" style={{width:window.innerHeight * 9 /16 + "px" }}>
          <div className="video-react-loading-spinner">
          </div>  
        </div>
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
        <button type="button" className={"btn back"} onClick={onCloseVideo}>
          Regresar
        </button>           
        {originalVideo.id != video.id?(
          <button type="button" className={"btn swap"} onClick={() => { dispatch(confirmAlternate())}}>
            Escoger
          </button>              
        ):(
          <div className={"active"}>
            Activo
          </div>                        
        )}   
      </div>
    </>
  );
}

export default VideoView;