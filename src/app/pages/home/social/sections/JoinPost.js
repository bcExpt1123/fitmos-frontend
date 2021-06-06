import React, {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import ShareDropDown from "./ShareDropDown";
import CommentView from "./CommentView";
import MentionTextarea from "./MentionTextarea";
import { convertTime } from "../../../../../lib/common";
import {createComment, appendComments, appendNextComments,appendNextReplies,hideReplies,  toggleLike, setItemValue} from "../../redux/post/actions";
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
  return (
    <div className="social-post join">
      <div className="post-header">
        <h3>¡Saluda a tu nueva compañera!</h3>
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
          <div className="cursor-pointer append" onClick={handlePreviousComments}> Show all&nbsp;{post.previousCommentsCount}&nbsp;{post.previousCommentsCount>1?<>comments</>:<>comment</>}</div>
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
              <div className="cursor-pointer comment-append-replies append" onClick={handleNextReplies(comment)}> View&nbsp;{comment.nextChildrenCount}&nbsp;{comment.nextChildrenCount>1?<>replies</>:<>reply</>}</div>
            }
          </React.Fragment>
        )}
        {(post.nextCommentsCount>0) && 
          <div className="cursor-pointer append" onClick={handleNextComments}> Show &nbsp;{post.nextCommentsCount}&nbsp;{post.nextCommentsCount>1?<>comments</>:<> comment</>}</div>
        }
        {currentUser.type==="customer" && <form onSubmit={onCommentFormSubmit}>
          <fieldset disabled={currentUser.customer.muteStatus}>
            <MentionTextarea content={commentContent} setContent={handleCommentChange} submit={true} commentForm={onCommentFormSubmit}/>
          </fieldset>
        </form>}
      </div>
    </div>
  );
}