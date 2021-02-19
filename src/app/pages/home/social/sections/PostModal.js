import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "video-react/dist/video-react.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "react-bootstrap";
import classnames from "classnames";
import SVG from "react-inlinesvg";
import SplashScreen from "../../../../../app/partials/layout/SplashScreen";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import PostContent from "./PostContent";
import CommentView from "./CommentView";
import MentionTextarea from "./MentionTextarea";
import RenderMedia from "./RenderMedia";
import {findPost, createComment, appendComments, appendNextComments,appendNextReplies,hideReplies,  toggleLike, readingPost, setItemValue} from "../../redux/post/actions";
const PostModal = ({show, media, onClose }) => {
  const post = useSelector(({post})=>post.post);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const dispatch = useDispatch();
  const [hidden, setHidden] = useState(false);
  useEffect(()=>{
    if(media&&show)dispatch(findPost({id:media.post_id,comment:1}));
  },[media,show]);
  const [commentContent, setCommentContent] = useState("");
  const handleCommentChange = (content)=>{
    setCommentContent(content);
  }
  const onCommentFormSubmit= e => {
    e.preventDefault();
    dispatch(createComment({post_id:post.id,content:commentContent}))
    setCommentContent("");
  }
  // const handlePreviousComments = ()=>{
  //   dispatch(appendComments(post.id));
  // }
  // const handleNextComments = ()=>{
  //   dispatch(appendNextComments(post.id));
  // }
  const history = useHistory();
  const handleNextReplies = (comment)=>()=>{
    dispatch(appendNextReplies(comment));
    history.push(window.location.pathname);
  }
  const handleHideReplies = (comment)=>()=>{
    dispatch(hideReplies(comment));
    history.push(window.location.pathname);
  }
  const handleLike = e=>{
    if(post.customer_id != currentUser.customer.id ){
      dispatch(toggleLike(post));
      history.push(window.location.pathname);
    }
  }
  useEffect(()=>{
    if(sliderRef.current){
      const mediaIndex = post.medias.findIndex((file) =>file.id === media.id);
      sliderRef.current.slickGoTo(mediaIndex);
      setActiveSlide(mediaIndex)
      setTimeout(() => {
        setHidden(true);
      }, 10);
    }
  },[post, show]);
  useEffect(()=>{
    if(show){
      document.body.style.cssText = "overflow:hidden !important";
      dispatch(setItemValue({name:'modalPost',value:true}));
      setTimeout(()=>{
        if(mentionTextarea.current){
          const height = 380+window.innerHeight-mentionTextarea.current.offsetTop;
          commentContainer.current.style.height = height+"px";
        }  
      },100);
    }
    else {
      document.body.style.cssText = "overflow:auto";
      dispatch(setItemValue({name:'modalPost',value:false}));
    }
  },[show]);
  const handleClose = ()=>{
    dispatch(readingPost(post));
    setHidden(false);
    onClose();
  }
  const [activeSlide, setActiveSlide] = useState(0);
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
    afterChange: (current) => setActiveSlide(current),
  };
  const sliderRef = useRef();
  const commentContainer = useRef();
  const mentionTextarea = useRef();
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
                  {post.medias.map((media, index)=>
                    <div key={media.id} className={classnames('post-media',{'image-hidden':hidden})}><RenderMedia file={media} videoIndex={0} status={activeSlide === index}/></div>
                  )}
                </Slider>
              </div>  
            </div>
            <div className="post social-post">
              <PostContent post={post} modalShow={true}/>
              <div className="post-footer">
                <div className="likes">
                  <span><i className={classnames("fas fa-heart cursor-pointer",{like:post.like} )}  onClick={handleLike}/> {post.likesCount}</span>
                  <span><i className="far fa-comment" /> {post.commentsCount}</span>
                </div>
                <div className="share">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Social/share.svg")} />
                </div>
              </div>
              <div className="post-comments" ref={commentContainer}>
                {post.comments.length>0&&post.comments.map(comment=>
                  <React.Fragment  key={comment.id}>
                    <div className={classnames("comment-view")}>
                      <CommentView comment={comment}/>
                    </div>
                    {(comment.children.length>0) && 
                      <div className="cursor-pointer  comment-append-replies append" onClick={handleHideReplies(comment)}> Hide all replies</div>
                    }
                    <div className={"comment-replies"}>
                      {
                        comment.children.map((reply)=>
                          <div className={classnames("comment-view reply")}  key={reply.id}>
                            <CommentView comment={reply}/>
                          </div>
                        )
                      }
                    </div>
                    {(comment.nextChildrenCount>0) && 
                      <div className="cursor-pointer comment-append-replies append" onClick={handleNextReplies(comment)}> View next replies</div>
                    }
                  </React.Fragment>
                )}
              </div>
              <form onSubmit={onCommentFormSubmit} className="comment-create" ref={mentionTextarea}>
                  <MentionTextarea content={commentContent} setContent={handleCommentChange} submit={true} commentForm={onCommentFormSubmit}/>
              </form>
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