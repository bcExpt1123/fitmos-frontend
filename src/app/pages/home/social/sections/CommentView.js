import React,{useState, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {createReply, deleteComment, updateComment} from "../../redux/post/actions";
import Avatar from "../../components/Avatar";

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
    if(!show)setTimeout(()=>commentTextarea.current.focus(),20);
    setShow(!show);
  }
  const commentTextarea = useRef();
  const handleCommentChange = (evt)=>{
    setReplyContent(evt.target.value);
  }
  const dispatch = useDispatch();
  const onReplyFormSubmit= e => {
    e.preventDefault();
    dispatch(createReply({post_id:comment.post_id,content:replyContent,parent_activity_id:comment.activity_id}))
    setReplyContent("");
  }
  const [showDropdown, setShowDropdown ] = useState(false);
  const toggleHandle = ()=>{
    setShowDropdown(!showDropdown);
  }
  const [showEdit, setShowEdit ] = useState(false);
  const handleDelete = ()=>{
    dispatch(deleteComment({id:comment.id, post_id:comment.post_id}));
  }
  const commentEditTextarea = useRef();
  const [commentEditContent, setcommentEditContent] = useState(comment.content);
  const openEditComment = ()=>{
    setShowEdit(true);
    setTimeout(()=>commentEditTextarea.current.focus(),20);
  }
  const handleCommentEditChange = (evt)=>{
    setcommentEditContent(evt.target.value);
  }
  const onEditFormSubmit = e => {
    e.preventDefault();
    dispatch(updateComment({id:comment.id,content:commentEditContent,post_id:comment.post_id}));
    setShowEdit(false);
  }
  return (
    <>
      <Avatar pictureUrls={comment.customer.avatarUrls} size="xs" />
      <div className="body">
        <div className="author">{comment.customer.first_name} {comment.customer.last_name}</div>
        <div className="content">{showEdit?
          <>
            <form onSubmit={onEditFormSubmit}>
              <textarea placeholder="Edit a comment" ref={commentEditTextarea} onChange={handleCommentEditChange} value={commentEditContent} />
              <button type="submit">Submit</button>
              <button type="button" onClick={()=>setShowEdit(false)}>Cancel</button>
            </form>
          </>
          :
          <>{comment.content}</>
        }</div>
        <div className="actions">
          <button className="like-comment">like</button>
          <button className="reply-comment" onClick={openReplyComment}>reply</button>      
          <div className="comment-time">{convertTime(comment.created_at)}</div>
        </div>
        {show&&(
          <form onSubmit={onReplyFormSubmit}>
            <textarea placeholder="Add a reply" ref={commentTextarea} onChange={handleCommentChange} value={replyContent} />
            <button type="submit">Submit</button>
          </form>        
        )}
      </div>
      <div className="popup-actions">
        <div className=" dropdown">
          <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
            <i className="fas fa-ellipsis-h dropbtn" />
          </button>
          <div className={classnames("dropdown-menu dropdown-menu-right" ,{show:showDropdown})}>
            {
              comment.customer_id == currentUser.customer.id?
              <>
                <a className={"dropdown-item"} onClick={openEditComment}>Edit Comment</a>
                <a className={"dropdown-item"} onClick={handleDelete}>Delete Comment</a>
              </>
              :
              <>
                {true?<a className={"dropdown-item"}>Hide comment</a>
                  :
                  <a className={"dropdown-item"}>Unfollow username</a>
                }
                <a className={"dropdown-item"}>Report Comment</a>
              </>
            }
          </div>
        </div>    
      </div>
    </>    
  )
}
export default CommentView;