import { Visibility } from "@material-ui/icons";
import React, {useEffect, useRef, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";
import { play } from "video-react/lib/actions/player";
import ViewableMonitor from '../../components/ViewableMonitor';
import {setItemValue} from "../../redux/post/actions";

const RenderMedia = ({file, videoIndex, modal, status, onOpenModal}) => {
  const player = useRef();
  const videoPlayer = useSelector(({post})=>post.videoPlayer);
  const videoPlayerModalMode = useSelector(({post})=>post.videoPlayerModalMode);
  const videoPlayerOpenModal = useSelector(({post})=>post.videoPlayerOpenModal);
  const videoPlayerOpenCurrentTime = useSelector(({post})=>post.videoPlayerOpenCurrentTime);
  const dispatch = useDispatch();
  /** visibleMonistor */
  const [visible, setVisible] = useState(false);
  const visibleChange = (status)=>{
    setVisible(status);
  }
  useEffect(()=>{
    if(modal)setVisible(status);
  },[status]);
  const findVideoWidth=()=>{
    if(player.current === null || file.width ===null) return;
    if( player.current.video.video.offsetHeight === 0){
      setTimeout(findVideoWidth, 100)
    }else{
      if(modal){
        const width = parseFloat(file.width);
        const height = parseFloat(file.height);
        if(width>height){
          player.current.video.video.nextElementSibling.nextElementSibling.nextElementSibling.style.bottom=(player.current.video.video.offsetHeight/2 - player.current.video.video.offsetWidth * height/width/2)+"px";
        }else{
          // console.log(width,file.height,player.current.video.video.offsetHeight)
          player.current.video.video.nextElementSibling.nextElementSibling.nextElementSibling.style.width=player.current.video.video.offsetHeight * width/height+"px";
          player.current.video.video.nextElementSibling.nextElementSibling.nextElementSibling.style.left=(player.current.video.video.offsetWidth/2 - player.current.video.video.offsetHeight * width/height/2)+"px";
        }
      }
    }
  }
  const playVideo = () =>{
    const playerStatue = player.current.getState();
    setTimeout(findVideoWidth, 100);
    if(playerStatue.player.paused){
      if(videoPlayerOpenModal!==false){
        player.current.seek(videoPlayerOpenCurrentTime);
        dispatch(setItemValue({name:"videoPlayerOpenCurrentTime",value:0}));
      }
      if(modal){
        setTimeout(()=>{if(player && player.current)player.current.play()},100)
      }else if(videoPlayerOpenModal === false)player.current.play();
      dispatch(setItemValue({name:"videoPlayerModalMode",value:modal}));
      dispatch(setItemValue({name:"videoPlayer",value:file.id}));
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
  // useEffect(()=>{
  //   console.log(file.id, visible)
  // },[visible])  
  const onOpenClick = (event)=>{
    onOpenModal(file)
  }
  useEffect(()=>{
    if(player.current && onOpenModal){
      player.current.video.video.addEventListener('click', onOpenClick);
    }
    return () => {
      if(player.current && onOpenModal){
        player.current.video.video.removeEventListener('click', onOpenClick);
      }
    };
  },[])
  return (
    file.type === "image"?<img src={file.url} alt="image" onClick={onOpenClick} />:
    modal?<Player
        ref={player}
        src={file.url}
        aspectRatio="16:9"
      >
        <LoadingSpinner />
      </Player>    
    :
      <ViewableMonitor visibleChange = {visibleChange} threshold={0.9}>
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