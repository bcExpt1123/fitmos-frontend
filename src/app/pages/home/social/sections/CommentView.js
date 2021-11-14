import React,{useState, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import {createReply, deleteComment, updateComment, toggleLike} from "../../redux/post/actions";
import Avatar from "../../components/Avatar";
import MentionTextarea from "./MentionTextarea";
import DisplayMentionContent from "./DisplayMentionContent";
import DropDown from "../../components/DropDown";
import { convertTime, can, onceRefresh } from "../../../../../lib/common";

const CommentView = ({comment})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [show, setShow ] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const openReplyComment = comment => ()=>{
    // if(!show)setTimeout(()=>commentTextarea.current.focus(),20);
    setReplyContent(`@[${comment.customer.first_name} ${comment.customer.last_name}](${comment.customer.id}) `);
    setShow(!show);
  }
  const commentTextarea = useRef();
  const handleCommentChange = (content)=>{
    setReplyContent(content);
  }
  const dispatch = useDispatch();
  const onReplyFormSubmit= e => {
    e.preventDefault();
    if(comment.level1>0)dispatch(createReply({post_id:comment.post_id,content:replyContent,parent_activity_id:comment.parent_activity_id}));
    else dispatch(createReply({post_id:comment.post_id,content:replyContent,parent_activity_id:comment.activity_id}));
    setReplyContent("");
    setShow(false);
  }
  // const [showDropdown, setShowDropdown ] = useState(false);
  // const toggleHandle = ()=>{
  //   setShowDropdown(!showDropdown);
  // }
  const [showEdit, setShowEdit ] = useState(false);
  const handleDelete = ()=>{
    dispatch(deleteComment(comment));
  }
  const commentEditTextarea = useRef();
  const [commentEditContent, setCommentEditContent] = useState(comment.content);
  const openEditComment = ()=>{
    setShowEdit(true);
  }
  const handleCommentEditChange = (text)=>{
    setCommentEditContent(text);
  }
  const onEditFormSubmit = e => {
    e.preventDefault();
    dispatch(updateComment({id:comment.id,content:commentEditContent,post_id:comment.post_id}));
    setShowEdit(false);
  }
  const handleLike = e=>{
    // if(comment.customer_id != currentUser.customer.id ){
      dispatch(toggleLike(comment));
    // }
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
              <form onSubmit={onceRefresh(onEditFormSubmit)}>
                <fieldset disabled={currentUser.customer.muteStatus}>
                  <MentionTextarea content={commentEditContent} setContent={handleCommentEditChange} submit={true}  commentForm={onEditFormSubmit} focus={true}/>
                </fieldset>  
              </form>
            </>
            :
            <DisplayMentionContent content={comment.content} />
          }
        </div>
        <div className="actions">
          <div className="comment-time">{convertTime(comment.created_at)}</div>
          <span className="like-comment"  >
            &nbsp;&nbsp;&nbsp;&nbsp;
            {comment.likesCount}
            &nbsp;
            Me gusta
          </span>
          <button className="reply-comment" onClick={openReplyComment(comment)}>Responder</button>      
        </div>
        {currentUser.type==="customer" && show&&(
          <form onSubmit={onceRefresh(onReplyFormSubmit)}>
            <fieldset disabled={currentUser.customer.muteStatus}>
              <MentionTextarea content={replyContent} setContent={handleCommentChange} submit={true} commentForm={onReplyFormSubmit} focus={true}/>
            </fieldset>
          </form>        
        )}
      </div>
      <div className="popup-actions">
        {
          (currentUser.type==="admin" && can(currentUser, "social")  || currentUser.type==="customer" && comment.customer_id == currentUser.customer.id)?
            <DropDown>
              {({show,toggleHandle,setShow})=>(
                <div className=" dropdown">
                  <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
                    <i className="fal fa-ellipsis-h dropbtn" />
                  </button>
                  <div className={classnames("dropdown-menu dropdown-menu-right" ,{show})}>
                      <>
                        <a className={"dropdown-item"} onClick={()=>{openEditComment(); setShow(false);}}>Editar</a>
                        <a className={"dropdown-item"} onClick={()=>{handleDelete();setShow(false);}}>Borrar</a>
                        {currentUser.type==="customer" && comment.customer_id == currentUser.customer.id && <span className={"dropdown-item"} onClick={handleLike}><i className={classnames("fa-heart cursor-pointer",{like:comment.like,fas:comment.like,far:comment.like==false})}/></span>}
                      </>
                  </div>
                </div>  
              )}    
            </DropDown>
          :  
            <span><i className={classnames("fa-heart cursor-pointer",{like:comment.like,fas:comment.like,far:comment.like==false})} onClick={handleLike}/></span>
        }
      </div>
    </>    
    :
    <></>
  )
}
export default CommentView;