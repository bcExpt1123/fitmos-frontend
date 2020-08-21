import React, {useState} from "react";
import classnames from "classnames";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {  useDispatch,useSelector } from "react-redux";

import Timer from "./Timer";
import { nextBlock,previousBlock,doneWorkout,initialBlock } from "../../redux/done/actions";

const Block = ({ block,renderLine,setAll })=>{
  const workouts = useSelector(({done})=>done.workouts);
  const step = useSelector(({done})=>done.step);
  const [isRunning, setIsRunning] = useState(false);
  const renderImage = (url)=>{
    if(url){
      return (
        <div className="image">
          <div className="background-container">
              <div className="background" 
                style={{
                  backgroundImage: "url(" + url + ")"
                }}
              >
              </div>
          </div>
        </div>  
      )                        
    }
  }
  const dispatch = useDispatch();
  const nextStep = ()=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return;
    }
    dispatch(nextBlock());
  }
  const previousStep = ()=>{
    dispatch(previousBlock());
  }
  const handleComplete = (item)=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return;
    }
    if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
    dispatch(initialBlock());
  }
  return (
    <div className="block">
      {renderImage(block.image_path)}
      {block.timer_type&&(
        <Timer type={block.timer_type} work={block.timer_work} round={block.timer_round} rest={block.timer_rest} setIsRunning={setIsRunning}/>
      )}
      {
        step==0?(
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
        step==workouts.current.blocks.length-1?(
          <div className="actions">
            <button onClick={previousStep} className="previous">
              Anterior
            </button>
            <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
              Completar
            </button>
          </div>  
        ):(
          step==0?(
            <div className="actions">
              <button className="previous" onClick={()=>setAll(true)}>Ver Workout</button>
              <button onClick={nextStep} className="next">
                Comenzar
              </button>
            </div>
          ):(
            <div className="actions">
              <button  className="previous" onClick={previousStep}>
                Anterior
              </button>
              <button onClick={nextStep} className="next">
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
