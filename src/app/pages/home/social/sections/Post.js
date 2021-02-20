import React,{ useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import RenderMedia from "./RenderMedia";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import PostContent from "./PostContent";
import CommentView from "./CommentView";
import MentionTextarea from "./MentionTextarea";
import ViewableMonitor from '../../components/ViewableMonitor';
import {createComment, appendComments, appendNextComments,appendNextReplies,hideReplies,  toggleLike, readingPost, setItemValue} from "../../redux/post/actions";

export default function Post({post, newsfeed, suggested, setShowPostModal, setMedia}) {
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
          setMediaContainerHeight(width*1+"px");
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
  /** comment */
  const [commentContent, setCommentContent] = useState("");
  const handleCommentChange = (content)=>{
    setCommentContent(content);
  }
  const dispatch = useDispatch();
  const onCommentFormSubmit= e => {
    e.preventDefault();
    dispatch(createComment({post_id:post.id,content:commentContent}))
    setCommentContent("");
  }
  const handlePreviousComments = ()=>{
    dispatch(appendComments(post.id));
  }
  const handleNextComments = ()=>{
    dispatch(appendNextComments(post.id));
  }
  const handleNextReplies = (comment)=>()=>{
    dispatch(appendNextReplies(comment));
  }
  const handleHideReplies = (comment)=>()=>{
    dispatch(hideReplies(comment));
  }
  const handleLike = e=>{
    if(post.customer_id != currentUser.customer.id ){
      dispatch(toggleLike(post));
    }
  }
  /** visibleMonistor */
  const [visible, setVisible] = useState(false);
  const visibleChange = (status)=>{
    if(status){
      dispatch(readingPost(post));
      //play start
    }
    setVisible(status);
  }
  const findVideoIndex = (id)=>{
    const videos = post.medias.filter(media=>media.type==='video');
    if(videos.length>0){
      if(videos[0].id === id) return 0;
    }
    return -1;
  }
  /** open post modal */
  const videoPlayer = useSelector(({post})=>post.videoPlayer);
  const openPostModal = (file)=>(evt)=>{
    if(window.innerWidth>800){
      setShowPostModal(true);
      setMedia(file);
      if(videoPlayer  === file.id){
        dispatch(setItemValue({name:"videoPlayerOpenModal",value:file.id}));
      }
      dispatch(setItemValue({name:"videoPlayerModalMode",value:true}));
    }
  }
  return (
    <ViewableMonitor visibleChange = {visibleChange}>
      {isViewable =>
        <div className="social-post">
          <PostContent post={post} newsfeed={newsfeed} suggested={suggested}/>
          <div className="medias-container">
            <div className="medias-body">
              <div className="medias" ref={mediaContainerRef}  style={{height:mediaContainerHeight}}>
                {post.medias.length == 1&&(
                  <div className="wrapper" style={{top:0,left:0,width:mediasWidth+"px",height:mediasWidth+"px"}}>
                    <div className="item cursor-pointer" onClick={openPostModal(post.medias[0])}>
                      <RenderMedia file={post.medias[0]} videoIndex = {findVideoIndex(post.medias[0].id)} status={visible} />
                    </div>
                  </div>
                )}
                {post.medias.length > 1&&(
                  <>
                    <div className="wrapper" style={{top:0,left:0,width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[0])}>
                        <RenderMedia file={post.medias[0]} videoIndex = {findVideoIndex(post.medias[0].id)} status={visible} />
                      </div>
                    </div>
                    <div className="wrapper" style={{top:0,left:mediasWidth/2+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[1])}>
                        <RenderMedia file={post.medias[1]} videoIndex = {findVideoIndex(post.medias[1].id)} status={visible} />
                      </div>
                    </div>
                  </>
                )}
                {post.medias.length == 3&&(
                  <>
                    <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth+"px",height:mediasWidth/2+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[2])}>
                        <RenderMedia file={post.medias[2]} videoIndex = {findVideoIndex(post.medias[2].id)} status={visible} />
                      </div>
                    </div>
                  </>
                )}
                {post.medias.length == 4&&(
                  <>
                    <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[2])}>
                        <RenderMedia file={post.medias[2]} videoIndex = {findVideoIndex(post.medias[2].id)} status={visible} />
                      </div>
                    </div>
                    <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth/2+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[3])}>
                        <RenderMedia file={post.medias[3]} videoIndex = {findVideoIndex(post.medias[3].id)} status={visible} />
                      </div>
                    </div>
                  </>
                )}
                {post.medias.length > 4&&(
                  <>
                    <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[2])}>
                        <RenderMedia file={post.medias[2]} videoIndex = {findVideoIndex(post.medias[2].id)} status={visible} />
                      </div>
                    </div>
                    <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth/3+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[3])}>
                        <RenderMedia file={post.medias[3]} videoIndex = {findVideoIndex(post.medias[3].id)} status={visible} />
                      </div>
                    </div>
                    <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth * 2/3+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                      <div className="item cursor-pointer" onClick={openPostModal(post.medias[4])}>
                        <RenderMedia file={post.medias[4]} videoIndex = {findVideoIndex(post.medias[4].id)} status={visible} />                        
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
              <span><i className={classnames(" fa-heart cursor-pointer",{like:post.like,fas:post.like,far:post.like==false} )}  onClick={handleLike}/>&nbsp;&nbsp;&nbsp;{post.likesCount}</span>
              <span><i className="far fa-comment" />&nbsp;&nbsp;&nbsp;{post.commentsCount}</span>
            </div>
            <div className="share">
              <SVG src={toAbsoluteUrl("/media/icons/svg/Social/share.svg")} />
            </div>
          </div>
          <div className="post-comments">
            {(post.previousCommentsCount>0) && 
              <div className="cursor-pointer append" onClick={handlePreviousComments}> Show preview comments</div>
            }
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
            {(post.nextCommentsCount>0) && 
              <div className="cursor-pointer append" onClick={handleNextComments}> Show next comments</div>
            }
            <form onSubmit={onCommentFormSubmit}>
              <MentionTextarea content={commentContent} setContent={handleCommentChange} submit={true} commentForm={onCommentFormSubmit}/>
            </form>
          </div>
        </div>
      }
    </ViewableMonitor>
  );
}