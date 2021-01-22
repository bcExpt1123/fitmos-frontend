import React,{ useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Player, LoadingSpinner } from 'video-react';
import Avatar from "../../components/Avatar";
import RenderMedia from "./RenderMedia";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import PostContent from "./PostContent";

export default function Post({post}) {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const mediaContainerRef = useRef();
  const [mediasWidth,setMediaWidth] = useState(100);
  const [mediaContainerHeight,setMediaContainerHeight] = useState('auto');
  const changeDimesions = ()=>{
    if(mediaContainerRef.current){
      const width = mediaContainerRef.current.clientWidth;
      setMediaWidth(width);
      switch(post.medias.length){
        case 0:
          setMediaContainerHeight("auto");
          break;
        case 1:
          setMediaContainerHeight(width+"px");
          break;
        case 2:
          setMediaContainerHeight(width/2+"px");
          break;
        case 3:
          setMediaContainerHeight(width*1.5+"px");
          break;
        case 4:
          setMediaContainerHeight(width+"px");
          break;
        default:
          setMediaContainerHeight(width * 5/6+"px");
          break;
      }
    }
  }
  useEffect(()=>{
    changeDimesions();
    setTimeout(changeDimesions,50);
    function handleResize() {
      changeDimesions();
    }
    window.addEventListener('resize', handleResize) 
    return ()=>window.removeEventListener("resize", handleResize);   
  },[]);
  return (
    <div className="social-post" key={post.id}>
      <PostContent post={post} />
      <div className="medias-container">
        <div className="medias-body">
          <div className="medias" ref={mediaContainerRef}  style={{height:mediaContainerHeight}}>
            {post.medias.length == 1&&(
              <div className="wrapper" style={{top:0,left:0,width:mediasWidth+"px",height:mediasWidth+"px"}}>
                <div className="item">
                  {RenderMedia(post.medias[0])}
                </div>
              </div>
            )}
            {post.medias.length > 1&&(
              <>
                <div className="wrapper" style={{top:0,left:0,width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[0])}
                  </div>
                </div>
                <div className="wrapper" style={{top:0,left:mediasWidth/2+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[1])}
                  </div>
                </div>
              </>
            )}
            {post.medias.length == 3&&(
              <>
                <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth+"px",height:mediasWidth+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[2])}
                  </div>
                </div>
              </>
            )}
            {post.medias.length == 4&&(
              <>
                <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[2])}
                  </div>
                </div>
                <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth/2+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[3])}
                  </div>
                </div>
              </>
            )}
            {post.medias.length > 4&&(
              <>
                <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[2])}
                  </div>
                </div>
                <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth/3+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[3])}
                  </div>
                </div>
                <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth * 2/3+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                  <div className="item">
                    {RenderMedia(post.medias[4])}
                  </div>
                  {post.medias.length > 5&&
                    <div className="additional">
                      <div>+{post.medias.length - 5}</div> 
                    </div>
                  }
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="post-footer">
        <div className="likes">
          <span><i className="fas fa-heart" /> 1.3K</span>
          <span><i className="far fa-comment" /> 162</span>
        </div>
        <div className="share">
          <SVG src={toAbsoluteUrl("/media/icons/svg/Social/share.svg")} />
        </div>
      </div>
    </div>
  );
}