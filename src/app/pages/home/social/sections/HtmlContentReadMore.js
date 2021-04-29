import React,{ useRef, useEffect, useState } from 'react';
import { Markup } from "interweave";
const SHOW_LESS_TEXT = 'Show Less';
const SHOW_MORE_TEXT = 'Read More';

const HtmlContentReadMore = ({content}) => {
  const ref = useRef();
  const [readMore, setReadMore] = useState(false);
  const [height, setHeight] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(()=>{
    if(ref.current){
      // console.warn('html-content');
      // console.log(ref.current.offsetHeight);
      if(ref.current.offsetHeight>100){
        ref.current.children[0].style.overflow="hidden";        
        if(ref.current.children[0].children.length>2){
          if(ref.current.children[0].children[0].offsetHeight>70){
            setHeight(ref.current.children[0].children[0].offsetHeight + "px");
            ref.current.children[0].style.height=ref.current.children[0].children[0].offsetHeight + "px";
          }else{            
            ref.current.children[0].style.height=(ref.current.children[0].children[1].getClientRects()[0].bottom - ref.current.children[0].children[0].getClientRects()[0].bottom + ref.current.children[0].children[1].offsetHeight)+ "px";
            setHeight((ref.current.children[0].children[1].getClientRects()[0].bottom - ref.current.children[0].children[1].getClientRects()[0].bottom + ref.current.children[0].children[1].offsetHeight)+ "px");
          }
          setReadMore(true);
          setIndex(index + 1);
        }else{
          const style = window.getComputedStyle(ref.current.children[0].children[0], null);
          const lineHeight = parseInt(style.lineHeight);
          const lineNumber = Math.round(100 / lineHeight);console.log(lineHeight, lineNumber,lineNumber * lineHeight+ "px");
          ref.current.children[0].style.height = lineNumber * lineHeight+ "px";
          setHeight(lineNumber * lineHeight+ "px");
          setReadMore(true);
          setIndex(index + 1);
        }
      }
    }
  },[]);
  useEffect(()=>{
    const containerBottom = ref.current.children[0].getClientRects()[0].bottom;
    let elementBottom;
    if(ref.current.children[0].children.length>2){
      if(ref.current.children[0].children[0].offsetHeight>70){
        elementBottom = ref.current.children[0].children[0].getClientRects()[0].bottom;
      }else{
        elementBottom = ref.current.children[0].children[1].getClientRects()[0].bottom;
      }
    }
    if(height){
      if(ref.current.offsetHeight>100){
        if(ref.current.children[0].children.length>2){
          setHeight((elementBottom-containerBottom + parseInt(height)) + 'px');
          ref.current.children[0].style.height = (elementBottom-containerBottom + parseInt(height)) + 'px';
        }
      }
    }
  },[index])
  const toggleReadMore = ()=>{
    if(readMore){
      ref.current.children[0].style.height="auto";
    }else{
      ref.current.children[0].style.height=height;
    }
    setReadMore(!readMore);
  }
  return (
    <>
      <div className="html-content" ref={ref}>
        <Markup content={content} />
        {height&&<div style={{textAlign:'right',marginTop:'-20px'}}>
          <button 
            onClick={toggleReadMore}
            className="read-more__button"
          >
            {readMore?SHOW_MORE_TEXT:SHOW_LESS_TEXT}
          </button>
        </div>}
      </div>
    </>
  )
};

export default HtmlContentReadMore;
