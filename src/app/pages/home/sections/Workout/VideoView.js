import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {Rating} from '@material-ui/lab';
import { withStyles } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Brightness1';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import Icon from "../../components/Icon";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const StyledRating = withStyles({
  iconFilled: {
    color: 'red',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);
const VideoView = () => {
  const dispatch = useDispatch();
  const video = useSelector(({workout})=>workout.video);
  const index = parseInt(Math.random() * 100) % 3 + 2;
  const url = process.env.REACT_APP_API_URL; 
  const file = url.substr(0,url.length-4) + `storage/media/mov/vid${index}.mp4`;
  const videoRef = useRef();
  const [wideVideo, setWideVideo] = useState(false);
  useEffect(()=>{
    if(videoRef.current){
      setTimeout(()=>{
        if(videoRef.current.videoWidth>0){
          if(videoRef.current.videoHeight/videoRef.current.videoWidth >1.25){
            setWideVideo(true);
          }else{
            setWideVideo(false);
          }
        }
      },100)
    }
  },[video]);
  return (
    <>
      <div className="text-center">
        <StyledRating
          name="customized-color"
          value={video.level}
          readOnly
          getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
          precision={1}
          icon={<FavoriteIcon fontSize="inherit" />}
        />                    
      </div>
      <div className={classnames({'workout-video':wideVideo})}>
        <Player
          ref={videoRef}
          autoPlay
          loop
        >
          <source src={video.url?video.url:file} />
        </Player>      
      </div>
      {(video.alternate_a || video.alternate_b)&&
        <div className="workout-footer mt-5">
          {video.alternate_a&&
            <button type="button" className={"back-button"} onClick={() => {}}>
              <Icon name="arrowLeft" className="arrow-left" />
            </button>              
          }
          <span>Alternar Movimiento</span>
          {video.alternate_b&&
            <button type="button" className={"back-button"} onClick={() => { }}>
              <Icon name="arrowRight" className="arrow-right" />
            </button>              
          }
        </div>
      }
    </>
  );
}

export default VideoView;