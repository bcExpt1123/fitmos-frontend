import React, { useState } from "react";
import { Player, LoadingSpinner } from 'video-react';
import "video-react/dist/video-react.css";

const ClickableMedia = ({file, setShow, setMedia}) => {
  const openPostModal = (file)=>(evt)=>{
    setShow(true);
    setMedia(file);
  }
  return (
    <div className="cursor-pointer" onClick={openPostModal(file)}>
      {file.type === "image"?<img src={file.url} alt="image" />:
        <>
          <video src={file.url} />
          {/* <Player
            src={file.url}
          >
            <LoadingSpinner />
          </Player>     */}
        </>
      }
    </div>
  );
}

export default ClickableMedia;