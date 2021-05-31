import React, {useEffect, useState} from "react";
import classnames from "classnames";
import { Tab, Tabs } from 'react-bootstrap';
import {  useDispatch,useSelector } from "react-redux";
import { Prompt } from 'react-router';

import Timer from "./Timer";
import { nextBlock,previousBlock,doneWorkout,startWorkout,initialBlock,setRunning, stopRunning, setTimer, removeTimer } from "../../redux/done/actions";

const Block = ({ block,renderLine,setAll, handleOpen })=>{
  const workout = process.env.REACT_APP_WORKOUT;
  const workouts = useSelector(({done})=>done.workouts);
  const isRunning = useSelector(({done})=>done.isRunning);
  const step = useSelector(({done})=>done.step);
  const renderImage = (url)=>{
    if(url){
      return (
        <div className="image">
          <img src = {url} alt="workout instruction" />
        </div>  
      )                        
    }
  }
  const dispatch = useDispatch();
  const changeConfirm = ()=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return false;
      dispatch(stopRunning());
    }
    return true;
  }
  const nextStep = (slug,item)=>{
    if(workout === 'update'){
      if(slug === 'comentario'){
        handleOpen();
        return;
      }
    }
    if( changeConfirm() ){
      dispatch(nextBlock());
      if(slug === 'con_content' || slug === 'sin_content'){
        if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
        else dispatch(startWorkout({date:workouts.current.today}));
      }else{
        dispatch(startWorkout({date:workouts.current.today}));
      }
    }
  }
  const previousStep = ()=>{
    if( changeConfirm() ){
      dispatch(previousBlock());
    }
  }
  const handleComplete = (item)=>{
    if( changeConfirm() ){
      if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
      dispatch(initialBlock());
    }
  }
  const setIsRunning = (running)=>{
    if(running)dispatch(setRunning());
    else dispatch(stopRunning());
  }
  useEffect(()=>{
    if(block&&block.timer_type) dispatch(setTimer());
    return ()=>{
      dispatch(removeTimer());
    }
  },[block]);// eslint-disable-line react-hooks/exhaustive-deps
  if(!block)return null;
  return (
    <div className="block">
      <Prompt
        when={isRunning}
        message={() =>
          `El reloj aún sigue corriendo. ¿Deseas avanzar?`
        }
      />      
      {renderImage(block.image_path)}
      {block.timer_type&&(
        <Timer type={block.timer_type} work={block.timer_work} round={block.timer_round} rest={block.timer_rest} description={block.timer_description} setIsRunning={setIsRunning}/>
      )}
      {
        step===0?(
          block.content&&block.content.map( (render,index1)=>(
            renderLine(render, index1)
          ))
        ):(
          <Tabs defaultActiveKey="workout" id="workout">
            <Tab eventKey="workout" title="Workout">
              {block.content&&block.content.map( (render,index1)=>(
                renderLine(render, index1)
              ))}
            </Tab>
            <Tab eventKey="note" title="Notas">
              {block.note&&block.note.map( (render,index1)=>(
                renderLine(render, index1)
              ))}
            </Tab>
          </Tabs>                        
        )
      }
      {
        step!==0 && step===workouts.current.blocks.length-1?(
          <div className="actions">
            <button onClick={previousStep} className="previous">
              Anterior
            </button>
            <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
              Completar
            </button>
          </div>  
        ):(
          step===0?(
            <div className="actions  mt-3 mb-3">
              {/* <button className="previous" onClick={()=>setAll(true)}>Ver Workout</button> */}
              <button onClick={()=>nextStep(block.slug,workouts.current)} className="start">
                Comenzar
              </button>
            </div>
          ):(
            <div className="actions">
              <button  className="previous" onClick={previousStep}>
                Anterior
              </button>
              <button onClick={()=>nextStep(block.slug,workouts.current)} className="next">
                Siguiente
              </button>
            </div>
          )
        )
      }
    </div>
  )
}
export default Block;
