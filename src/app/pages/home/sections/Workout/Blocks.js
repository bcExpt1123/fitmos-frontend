import React from "react";
import classnames from "classnames";
import {  useDispatch, useSelector } from "react-redux";

import { doneWorkout } from "../../redux/done/actions";
import BlockSection from "./BlockSection";

const Blocks = ({ renderLine,setAll })=>{
  const workouts = useSelector(({done})=>done.workouts);
  const dispatch = useDispatch();
  const handleComplete = (item)=>{
    if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
  }
  return (
    <>
    {
      workouts.current.blocks.map( (block,index)=>(
        <div className="block" key={index}>
          <BlockSection block={block} renderLine={renderLine} index={index}/>
        </div>
      ))
    }
    <div className="actions">
      <button className="previous" onClick={()=>setAll(false)}>Iniciar Workout</button>
      {workouts&&workouts.current&&workouts.current.read==false&&(
        <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
          Completar
        </button>
      )}
    </div>
  </>
)}
export default Blocks;
