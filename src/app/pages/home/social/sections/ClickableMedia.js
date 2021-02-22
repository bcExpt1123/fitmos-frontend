import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "video-react/dist/video-react.css";
import { setItemValue } from "../../redux/post/actions";

const ClickableMedia = ({file, setShow, setMedia}) => {
  const videoPlayer = useSelector(({post})=>post.videoPlayer);
  const dispatch = useDispatch();
  const openPostModal = (file)=>(evt)=>{
    if(window.innerWidth>800){
      setShow(true);
      setMedia(file);
      if(videoPlayer  === file.id){
        dispatch(setItemValue({name:"videoPlayerOpenModal",value:file.id}));
      }
      dispatch(setItemValue({name:"videoPlayerModalMode",value:true}));
    }
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