import React, {useEffect, useRef, useState} from "react";
import classnames from "classnames";
import RenderMedia from "./RenderMedia";

const RenderModalMedia = ({hidden, media, sliderContainerRef,activeSlide, index,handleClose }) => {
  const itemRef = useRef();
  useEffect(()=>{
    if(itemRef.current){
      itemRef.current.parentNode.parentNode.addEventListener('click', handleClose);
    }
    return () => {
      if(itemRef.current){
        itemRef.current.parentNode.parentNode.removeEventListener('click', handleClose);
      }
    };
  },[itemRef])
  return (
    <div className={classnames('post-media',{'image-hidden':hidden})} ref={itemRef}>
      <RenderMedia file={media} videoIndex={media.type=="video"?0:-1} status={activeSlide === index} modal={true} containerRef={sliderContainerRef}/>
    </div>
  );
}

export default RenderModalMedia;