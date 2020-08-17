import React from "react";
import classnames from "classnames";
import {  useDispatch, useSelector } from "react-redux";

import { doneWorkout } from "../../redux/done/actions";

const Blog = ({ renderLine })=>{
  const workouts = useSelector(({done})=>done.workouts);
  const dispatch = useDispatch();
  const handleComplete = (item)=>{
    if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
  }
  return (
    <div className="blog">
      {
        workouts&&workouts.current&&workouts.current.blocks.map( (block)=>(
          block.content&&block.content.map( (render,index1)=>(
            renderLine(render, index1)
          ))
        ))
      }
      {workouts&&workouts.current&&workouts.current.read==false&&(
        <div className="actions">
          <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
            Completar
          </button>
        </div>
      )}
    </div>
  )}
export default Blog;
