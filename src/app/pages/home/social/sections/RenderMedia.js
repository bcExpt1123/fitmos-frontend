import React from "react";
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";

const RenderMedia = (file) => {
  return (
    file.type === "image"?<img src={file.url} alt="image" />:
    <>
    {/* <video src={file.url} /> */}
      <Player
        src={file.url}
        aspectRatio="16:9"
      >
        <LoadingSpinner />
      </Player>    
    </>
  );
}

export default RenderMedia;