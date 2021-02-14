import React, {useEffect, useRef} from "react";
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";

const RenderMedia = ({file, videoIndex, status}) => {
  const player = useRef();
  useEffect(()=>{
    if(videoIndex == 0 && status){
      if(player.current)player.current.play();
      else setTimeout(()=>{
        if(player.current)player.current.play();
        else setTimeout(()=>{
          if(player.current)player.current.play();
        },200);
      },200)
    }
  },[status])
  return (
    file.type === "image"?<img src={file.url} alt="image" />:
    <>
    {/* <video src={file.url} /> */}
      <Player
        ref={player}
        src={file.url}
        aspectRatio="16:9"
      >
        <LoadingSpinner />
      </Player>    
    </>
  );
}

export default RenderMedia;