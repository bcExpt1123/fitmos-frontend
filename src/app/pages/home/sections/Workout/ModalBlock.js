import React, {useEffect, useState} from "react";
import classnames from "classnames";
import { Tab, Tabs } from 'react-bootstrap';
import {  useDispatch,useSelector } from "react-redux";
import { Prompt } from 'react-router';

import Timer from "./Timer";
import { doneWorkout,startWorkout,setRunning, stopRunning, setTimer, removeTimer } from "../../redux/done/actions";
import { nextModalBlock,previousModalBlock,initialModalBlock } from "../../redux/workout/actions";

const ModalBlock = ({ block,renderLine,setAll, handleOpen, onHide })=>{
  const workout = process.env.REACT_APP_WORKOUT;
  const workouts = useSelector(({done})=>done.workouts);
  const isRunning = useSelector(({done})=>done.isRunning);
  const step = useSelector(({workout})=>workout.step);
  const [show, setShow] = useState(false);
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
      }
    }
    if( changeConfirm() ){
      dispatch(nextModalBlock());
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
      dispatch(previousModalBlock());
    }
  }
  const handleComplete = (item)=>{
    if( changeConfirm() ){
      if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
      // dispatch(initialModalBlock());
      dispatch(nextModalBlock());
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
      }
      {
        step!==0 && step===workouts.current.blocks.length-1?(
          <div className="actions">
            {step>1&&<button onClick={previousStep} className="previous">
              Anterior
            </button>}
            {step==1&&
              <button  className="previous" onClick={onHide}>
                Anterior
              </button>
            }
            <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
              Completar
            </button>
          </div>  
        ):(
          step===0?(
            <div className="actions">
              <button className="previous" onClick={()=>setAll(true)}>Ver Workout</button>
              <button onClick={()=>nextStep(block.slug,workouts.current)} className="next">
                Comenzar
              </button>
            </div>
          ):(
            <div className="actions">
              {step>1&&
                <button  className="previous" onClick={previousStep}>
                  Anterior
                </button>
              }
              {step==1&&
                <button  className="previous" onClick={onHide}>
                  Anterior
                </button>
              }
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
export default ModalBlock;