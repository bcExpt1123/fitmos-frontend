import React,{useState, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import {createReply, deleteComment, updateComment, toggleLike} from "../../redux/post/actions";
import Avatar from "../../components/Avatar";
import MentionTextarea from "./MentionTextarea";
import DisplayMentionContent from "./DisplayMentionContent";
import LinkProfile from "./customer/Link";
import DropDown from "../../components/DropDown";

const convertTime = (timeString)=>{
  const now = new Date();
  const other = new Date(timeString+" GMT-5");
  const diffTime = (now.getTime() - other.getTime())/1000;
  if(diffTime<60){
    return "1m";
  }else if(diffTime<3600){
    return Math.round(diffTime/60)+"m";
  }else if(diffTime<3600*24){
    return Math.round(diffTime/3600)+"h";
  }else if(diffTime<3600*24*30){
    return Math.round(diffTime/3600/24)+"d";
  }else{
    return timeString;
  }
}
const CommentView = ({comment})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [show, setShow ] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const openReplyComment = ()=>{
    // if(!show)setTimeout(()=>commentTextarea.current.focus(),20);
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
    if(comment.customer_id != currentUser.customer.id ){
      dispatch(toggleLike(comment));
    }
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
                <MentionTextarea content={commentEditContent} setContent={handleCommentEditChange} submit={true}/>
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
            likes
          </span>
          <button className="reply-comment" onClick={openReplyComment}>Replay</button>      
        </div>
        {show&&(
          <form onSubmit={onReplyFormSubmit}>
            <MentionTextarea content={replyContent} setContent={handleCommentChange} submit={true}/>
          </form>        
        )}
      </div>
      <div className="popup-actions">
        {
          comment.customer_id == currentUser.customer.id?
            <DropDown>
              {({show,toggleHandle,setShow})=>(
                <div className=" dropdown">
                  <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
                    <i className="fas fa-ellipsis-h dropbtn" />
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
          :  
            <span><i className={classnames("far fa-heart",{like:false})} onClick={handleLike}/></span>
        }
      </div>
    </>    
    :
    <></>
  )
}
export default CommentView;