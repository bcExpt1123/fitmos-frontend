import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "video-react/dist/video-react.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "react-bootstrap";
import classnames from "classnames";
import { findPost } from "../../redux/post/actions";
import SplashScreen from "../../../../../app/partials/layout/SplashScreen";
import PostContent from "./PostContent";
import RenderMedia from "./RenderMedia";
const PostModal = ({show, media, onClose }) => {
  const post = useSelector(({post})=>post.post);
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(false);
  useEffect(()=>{
    if(media)dispatch(findPost(media.post_id));
  },[media]);
  useEffect(()=>{
    if(sliderRef.current){
      const mediaIndex = post.medias.findIndex((file) =>file.id === media.id);
      sliderRef.current.slickGoTo(mediaIndex);
      setTimeout(() => {
        setHidden(true);
      }, 10);
    }
  },[post, show]);
  useEffect(()=>{
    if(show)document.body.style.cssText = "overflow:hidden !important";
    else document.body.style.cssText = "overflow:auto";
  },[show]);
  const handleClose = ()=>{
    setHidden(false);
    onClose();
  }
  const settings = {
    arrows: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 5000,
    fade: true,
    speed: 1000,
    lazyLoad: true,
    slidesToShow: 1,
    centerMode:true,
    slidesToScroll: 1,
  };
  const sliderRef = useRef();
  return (
    <Modal
      dialogClassName="post-modal"
      show={show}
      onHide={onClose}
      animation={false}
      centered
    >
      <Modal.Body>
        {post?
          <>
            <div className="slides">
              <div className="close" onClick={handleClose}>
                <i className="fas fa-times" />
              </div>
              <div className="sliders">
                <Slider {...settings} ref={sliderRef}>
                  {post.medias.map(media=>
                    <div key={media.id} className={classnames('post-media',{'image-hidden':hidden})}>{RenderMedia(media)}</div>
                  )}
                </Slider>
              </div>  
            </div>
            <div className="post social-post">
              <PostContent post={post} />
            </div>
          </>
          :
          <div className="loading" style={{marginTop:"300px"}}>
            <SplashScreen />
          </div>
        }    
      </Modal.Body>
    </Modal>
  );
}

export default PostModal;