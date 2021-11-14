import React, {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import ShareDropDown from "./ShareDropDown";
import CommentView from "./CommentView";
import MentionTextarea from "./MentionTextarea";
import { convertTime, onceRefresh } from "../../../../../lib/common";
import ViewableMonitor from '../../components/ViewableMonitor';
import {createComment, appendComments, appendNextComments,appendNextReplies,hideReplies,  toggleLike, setItemValue, readingPost} from "../../redux/post/actions";
import BirthdayCustomer from "./customer/BirthdayCustomer";

export default function JoinPost({post}) {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
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
    // if(post.customer_id != currentUser.customer.id ){
      dispatch(toggleLike(post));
    // }
  }
  const openLikersModal = ()=>{
    if(post.likesCount>0){
      dispatch(setItemValue({name:"likersOpenSetting", value:{show:true,activityId:post.activity_id}}));
    }
  }
  const visibleChange = (status)=>{
    if(status){
      dispatch(readingPost(post));
    }
  }
  return (
    <ViewableMonitor visibleChange = {visibleChange} threshold={0.3}>
      {() =>
        <div className="social-post join">
          <div className="post-header">
            <h3>¡Saluda a tu&nbsp; 
              {post.customer.gender === 'Male' ? 
                <>nuevo compañero!</>
                :
                <>nueva compañera!</>
              }
            </h3>
            <div className="post-time" >{convertTime(post.created_at)}</div>
          </div>
          <div className="post-body">
            <BirthdayCustomer customer={post.customer} post={post}/>
          </div>
          <div className="post-footer">
            <div className="likes">
              <span><i className={classnames(" fa-heart cursor-pointer",{like:post.like,fas:post.like,far:post.like==false} )}  onClick={handleLike}/>&nbsp;&nbsp;&nbsp;
                <span className={classnames({"cursor-pointer":post.likesCount>0})} onClick={openLikersModal}>{post.likesCount}</span>
              </span>
              <span><i className="far fa-comment" />&nbsp;&nbsp;&nbsp;{post.commentsCount}</span>
            </div>
            <ShareDropDown post={post} />
          </div>
          <div className="post-comments">
            {(post.previousCommentsCount>0) && 
              <div className="cursor-pointer append" onClick={handlePreviousComments}> Ver más&nbsp;{post.previousCommentsCount>1?<>comentarios</>:<>comentario</>}&nbsp;({post.previousCommentsCount})</div>
            }
            {post.comments.length>0&&post.comments.map(comment=>
              <React.Fragment  key={comment.id}>
                <div className={classnames("comment-view")}>
                  <CommentView comment={comment}/>
                </div>
                {(comment.children.length>0) && 
                  <div className="cursor-pointer  comment-append-replies append" onClick={handleHideReplies(comment)}> Ocultar comentarios</div>
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
                  <div className="cursor-pointer comment-append-replies append" onClick={handleNextReplies(comment)}> Ver&nbsp;{comment.nextChildrenCount}&nbsp;{comment.nextChildrenCount>1?<>comentarios</>:<>comentario</>}</div>
                }
              </React.Fragment>
            )}
            {(post.nextCommentsCount>0) &&
              <div className="cursor-pointer append" onClick={handleNextComments}> Mostrar &nbsp;{post.nextCommentsCount}&nbsp;{post.nextCommentsCount>1?<>comentarios</>:<> comentario</>}</div>
            }
            {currentUser.type==="customer" && <form onSubmit={onceRefresh(onCommentFormSubmit)}>
              <fieldset disabled={currentUser.customer.muteStatus}>
                <MentionTextarea content={commentContent} setContent={handleCommentChange} submit={true} commentForm={onCommentFormSubmit}/>
              </fieldset>
            </form>}
          </div>
        </div>
      }
    </ViewableMonitor>  
  );
}