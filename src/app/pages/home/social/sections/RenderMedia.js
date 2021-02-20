import React, {useEffect, useRef, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";
import ViewableMonitor from '../../components/ViewableMonitor';
import {setItemValue} from "../../redux/post/actions";

const RenderMedia = ({file, videoIndex, modal, status}) => {
  const player = useRef();
  const videoPlayer = useSelector(({post})=>post.videoPlayer);
  const videoPlayerModalMode = useSelector(({post})=>post.videoPlayerModalMode);
  const videoPlayerOpenModal = useSelector(({post})=>post.videoPlayerOpenModal);
  const videoPlayerOpenCurrentTime = useSelector(({post})=>post.videoPlayerOpenCurrentTime);
  const dispatch = useDispatch();
  /** visibleMonistor */
  const [visible, setVisible] = useState(false);
  const visibleChange = (status)=>{
    console.log(status)
    setVisible(status);
  }
  useEffect(()=>{
    if(modal)setVisible(status);
  },[status]);
  const playVideo = () =>{
    const playerStatue = player.current.getState();
    if(playerStatue.player.paused){
      if(videoPlayerOpenModal!==false){
        player.current.seek(videoPlayerOpenCurrentTime);
        dispatch(setItemValue({name:"videoPlayerOpenCurrentTime",value:0}));
      }
      if(modal){
        setTimeout(()=>player.current.play(),100)
      }else player.current.play();
      dispatch(setItemValue({name:"videoPlayer",value:file.id}));
      dispatch(setItemValue({name:"videoPlayerModalMode",value:modal}));
    }
  }
  const playVideos = ()=>{
    if(videoIndex == 0){
      if(visible ){
        // if(!videoPlayer){
          if(player.current){
            playVideo();
          }
          else setTimeout(()=>{
            if(player.current){
              playVideo();
            }
            else setTimeout(()=>{
              if(player.current){
                playVideo();
              }
            },200);
          },200)
        // }
      }
      // if(videoPlayer){
        if(player.current){
          const playerStatue = player.current.getState();
          if(!playerStatue.player.paused){
            if(videoPlayer && videoPlayer == file.id && videoPlayerModalMode == modal){
              dispatch(setItemValue({name:"videoPlayer",value:false}));
              dispatch(setItemValue({name:"videoPlayerModalMode",value:false}));
            }
            if(modal)player.current.seek(0);
            else{
              if( videoPlayerOpenModal === videoPlayer &&  videoPlayer!==false){
                dispatch(setItemValue({name:"videoPlayerOpenCurrentTime",value:playerStatue.player.currentTime}));
              }
            }
            player.current.pause();
          }
        }
      // }
    } 
  }
  useEffect(()=>{
    playVideos();
  },[visible, videoPlayer, videoPlayerModalMode])
  return (
    file.type === "image"?<img src={file.url} alt="image" />:
    modal?<Player
        ref={player}
        src={file.url}
        aspectRatio="16:9"
      >
        <LoadingSpinner />
      </Player>    
    :
      <ViewableMonitor visibleChange = {visibleChange}>
        {isViewable =>
          <Player
            ref={player}
            src={file.url}
            aspectRatio="16:9"
          >
            <LoadingSpinner />
          </Player>    
        }
      </ViewableMonitor>
  );
}

export default RenderMedia;