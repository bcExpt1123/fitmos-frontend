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
      if(file.type=="video"){
        dispatch(setItemValue({name:"videoPlayerOpenModal",value:file.id}));
      }else{
        dispatch(setItemValue({name:"videoPlayerOpenModal",value:false}));
      }
      dispatch(setItemValue({name:"videoPlayerModalMode",value:true}));
    }
  }
  const convertImageUrl = (url)=>{
    const object = new URL(url);
    if(object.protocol == 'blob:')return url;
    let filename = object.pathname.split('/').reverse()[0];
    const ext = filename.split('.')[1]; 
    let replaceFileName = filename.split('.')[0] + '-150X150.'+ext;
    return url.replace(filename, replaceFileName);
  }
  return (
    <div className="cursor-pointer" onClick={openPostModal(file)}>
      {file.type === "image"?<img src={convertImageUrl(file.url)} alt="image" />:
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