import React from "react";
import classnames from "classnames";
import {  useDispatch, useSelector } from "react-redux";
import { Prompt } from 'react-router';

import Timer from "./Timer";
import { doneWorkout, setRunning, stopRunning } from "../../redux/done/actions";

const Blog = ({ renderLine })=>{
  const workouts = useSelector(({done})=>done.workouts);
  const isRunning = useSelector(({done})=>done.isRunning);
  const dispatch = useDispatch();
  const handleComplete = (item)=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return;
    }
    if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
  }
  const setIsRunning = (running)=>{
    if(running)dispatch(setRunning());
    else dispatch(stopRunning());
  }
  return (
    <div className="blog">
      <Prompt
        when={isRunning}
        message={() =>
          `El reloj aún sigue corriendo. ¿Deseas avanzar?`
        }
      />
      {
        workouts&&workouts.current&&workouts.current.blocks.map( (block, index)=>(
          <React.Fragment key={index}>
            {block.timer_type&&(
              <Timer type={block.timer_type} work={block.timer_work} round={block.timer_round} rest={block.timer_rest}  setIsRunning={setIsRunning}/>
            )}
            {
              block.content&&block.content.map( (render,index1)=>(
                renderLine(render, index1)
              ))
            }
          </React.Fragment>
        ))
      }
      {workouts&&workouts.current&&workouts.current.read===false&&(
        <div className="actions">
          <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
            Completar
          </button>
        </div>
      )}
    </div>
  )}
export default Blog;
