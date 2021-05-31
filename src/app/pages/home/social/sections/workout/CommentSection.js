import React, { useState } from "react";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import SaveCommentForm from "../../../sections/Workout/SaveCommentForm";

const WorkoutCommentSection = ({comment})=>{
  const currentUser = useSelector(({auth})=>auth.currentUser)
  const renderLine = (line,index)=>{
    switch(line.tag){
      case 'h1':
        return <h1 key={index}>{line.content}</h1>;
      case 'h2':
        return <h2 key={index}>{line.content}</h2>;
      case 'p':
        return <p key={index}>
          {line.before_content}&nbsp;
          {line.video&&(
            <span>
              {line.video.name}
            </span>
          )}          
          {line.after_content}
          </p>;
      default:
    }
  }
  const [showEdit, setShowEdit] = useState(false);
  const openEdit = ()=>{
    setShowEdit(true);
  }
  return <div className="workout">
  {comment.workout.map((line, index)=>
    renderLine(line, index)
  )}
  {parseInt(currentUser.customer.id) === parseInt(comment.customer_id) && !showEdit && (
    <i className="fa fa-edit" onClick={openEdit}/>
  )}
  {showEdit?
    <SaveCommentForm 
      id={comment.id}
      initialValues={{
        content: comment.content,
        dumbells_weight: comment.dumbells_weight
      }}
      publishDate={comment.publish_date}
      onCancel={() =>setShowEdit(false)}
    />  
    :
    <div className="comment textarea-pre">
      <NavLink
        to={"/"+comment.customer.username}
        className={"link-profile"}
      >
        <Avatar pictureUrls={comment.customer.avatarUrls} size="xs" />
      </NavLink>
      {comment.content}
    </div>
  }
  {comment.dumbells_weight && !showEdit && <div style={{color:"rgba(54, 54, 54, 0.7)"}}>Peso utilizado:{comment.dumbells_weight}lbs</div>}
</div>

}

export default WorkoutCommentSection;