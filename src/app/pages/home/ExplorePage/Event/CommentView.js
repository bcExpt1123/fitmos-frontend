import React,{useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import {$createReply, $deleteComment, $updateComment} from "../../../../../modules/subscription/evento";
import Avatar from "../../components/Avatar";
import MentionTextarea from "../../social/sections/MentionTextarea";
import DisplayMentionContent from "../../social/sections/DisplayMentionContent";
import DropDown from "../../components/DropDown";
import { convertTime } from "../../../../../lib/common";

const CommentView = ({comment})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [show, setShow ] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const openReplyComment = ()=>{
    // if(!show)setTimeout(()=>commentTextarea.current.focus(),20);
    setShow(!show);
  }
  const handleCommentChange = (content)=>{
    setReplyContent(content);
  }
  const dispatch = useDispatch();
  const onReplyFormSubmit= e => {
    e.preventDefault();
    if(comment.level1>0)dispatch($createReply(comment.evento_id,replyContent,comment.parent_id));
    else dispatch($createReply(comment.evento_id,replyContent,comment.id));
    setReplyContent("");
    setShow(false);
  }
  const [showEdit, setShowEdit ] = useState(false);
  const handleDelete = ()=>{
    dispatch($deleteComment(comment));
  }
  const [commentEditContent, setCommentEditContent] = useState(comment.content);
  const openEditComment = ()=>{
    setShowEdit(true);
  }
  const handleCommentEditChange = (text)=>{
    setCommentEditContent(text);
  }
  const onEditFormSubmit = e => {
    e.preventDefault();
    dispatch($updateComment(comment.id,commentEditContent,comment.evento_id));
    setShowEdit(false);
  }
  return (
    comment.customer?
    <>
      <NavLink
        to={"/"+comment.customer.username}
        className={"link-profile"}
      >
        <Avatar pictureUrls={comment.customer.avatarUrls} size="xs" />
      </NavLink>
      <div className="body">
        <div className="author">
          <NavLink
            to={"/"+comment.customer.username}
            className={"link-profile"}
          >
            {comment.customer.first_name+' '+comment.customer.last_name}
          </NavLink>
        </div>
        <div className="content">
          {showEdit?
            <>
              <form onSubmit={onEditFormSubmit}>
                <MentionTextarea content={commentEditContent} setContent={handleCommentEditChange} submit={true} commentForm={onEditFormSubmit}/>
              </form>
            </>
            :
            <DisplayMentionContent content={comment.content} />
          }
        </div>
        <div className="actions">
          <div className="comment-time">{convertTime(comment.created_at)}</div>
          <button className="reply-comment" onClick={openReplyComment}>Reply</button>      
        </div>
        {show&&(
          <form onSubmit={onReplyFormSubmit}>
            <MentionTextarea content={replyContent} setContent={handleCommentChange} submit={true} commentForm={onReplyFormSubmit}/>
          </form>        
        )}
      </div>
      <div className="popup-actions">
        {
          comment.customer_id == currentUser.customer.id&&
            <DropDown>
              {({show,toggleHandle,setShow})=>(
                <div className=" dropdown">
                  <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
                    <i className="fal fa-ellipsis-h dropbtn" />
                  </button>
                  <div className={classnames("dropdown-menu dropdown-menu-right" ,{show})}>
                      <>
                        <a className={"dropdown-item"} onClick={openEditComment}>Edit Comment</a>
                        <a className={"dropdown-item"} onClick={handleDelete}>Delete Comment</a>
                      </>
                  </div>
                </div>  
              )}    
            </DropDown>
        }
      </div>
    </>    
    :
    <></>
  )
}
export default CommentView;