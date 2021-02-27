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
    playVideos();
  },[visible]);
  useEffect(()=>{
    if(modal)setVisible(status);
  },[status]);
  const [index, setIndex] = useState(0);
  const [videoTimeIndex, setVideoTimeIndex] = useState(0);
  const findVideoWidth=()=>{
    if(player.current === null || file.width ===null) return;
    if( player.current.video.video.offsetHeight === 0){
      setTimeout(()=>setIndex(index+1), 100);
    }else{
      if(modal){
        if(videoPlayerOpenModal===file.id){
          const width = parseFloat(file.width);
          const height = parseFloat(file.height);
          if(width>height){
            player.current.video.video.nextElementSibling.nextElementSibling.nextElementSibling.style.bottom=(player.current.video.video.offsetHeight/2 - player.current.video.video.offsetWidth * height/width/2)+"px";
          }else{
            player.current.video.video.nextElementSibling.nextElementSibling.nextElementSibling.style.width=player.current.video.video.offsetHeight * width/height+"px";
            player.current.video.video.nextElementSibling.nextElementSibling.nextElementSibling.style.left=(player.current.video.video.offsetWidth/2 - player.current.video.video.offsetHeight * width/height/2)+"px";
          }
          if(player.current){
            if(videoPlayerOpenCurrentTime.id == file.id){
              player.current.seek(videoPlayerOpenCurrentTime.time);
              dispatch(setItemValue({name:"videoPlayerOpenCurrentTime",value:{id:-1, time:0}}));
            }
            setVideoTimeIndex(videoTimeIndex + 1);
          }
        }else{
          setTimeout(()=>setIndex(index+1), 100);
        }
      }
    }
  }
  useEffect(()=>{
    if( modal && videoPlayerOpenModal===file.id){
      if(player.current){
        player.current.pause();
        player.current.play();
      }      
    }
  },[videoTimeIndex])
  useEffect(()=>{
    if(index>0)findVideoWidth();
  },[index]);
  const playModalVideo = ()=>{
    if(player && player.current){
      if(videoPlayerOpenModal!==false){
      }
      if(videoPlayerOpenModal===file.id){
        if( modal ){
          player.current.play();
        }
        else setTimeout(()=>setIndex(index + 1), 100);
      }
    }
  }
  useEffect(()=>{
    playModalVideo();
  },[videoPlayerOpenModal])
  const playVideo = () =>{
    const playerStatue = player.current.getState();
    setTimeout(()=>setIndex(1), 100);
    if(playerStatue.player.paused){      
      if(modal){
      }else if(videoPlayerOpenModal === false){
        player.current.play();
        dispatch(setItemValue({name:"videoPlayerModalMode",value:modal}));
        dispatch(setItemValue({name:"videoPlayer",value:file.id}));
      }
    }
  }
  const playVideos = ()=>{
    if(videoIndex == 0){
      // if(videoPlayer){
        if(player.current){
          const playerStatue = player.current.getState();
          if(!playerStatue.player.paused || !visible && playerStatue.player.paused){
            if(videoPlayer && videoPlayer == file.id && videoPlayerModalMode == modal){
              dispatch(setItemValue({name:"videoPlayer",value:false}));
              dispatch(setItemValue({name:"videoPlayerModalMode",value:false}));
            }
            if(modal)player.current.seek(0);
            else{
              if( file.id === videoPlayer ){
                dispatch(setItemValue({name:"videoPlayerOpenCurrentTime",value:{id:file.id, time:playerStatue.player.currentTime}}));
              }
            }
            player.current.pause();
          }
        }
      // }
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
    } 
  }
  useEffect(()=>{
    playVideos();
  },[videoPlayer, videoPlayerModalMode])
  const onOpenClick = (event)=>{
    onOpenModal(file)
  }
  useEffect(()=>{
    if(!modal){
      if(player.current && onOpenModal){
        player.current.video.video.addEventListener('click', onOpenClick);
      }
    }
    return () => {
      if(player.current && modal===undefined){
        player.current.video.video.removeEventListener('click', onOpenClick);
      }
    };
  },[])
  const convertImageUrl = (url)=>{
    const object = new URL(url);
    if(object.protocol == 'blob:' || modal == true )return url;
    let filename = object.pathname.split('/').reverse()[0];
    const ext = filename.split('.')[1]; 
    let replaceFileName = filename.split('.')[0] + '-1024X1024.'+ext;
    return url.replace(filename, replaceFileName);
  }
  return (
    file.type === "image"?<img src={convertImageUrl(file.url)} alt="image" onClick={onOpenClick} />:
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