import React from "react";
import {  useSelector, useDispatch } from "react-redux";

import BlockSection from "./BlockSection";
import { nextBlock } from "../../redux/done/actions";

const Blocks = ({ renderLine,setAll })=>{
  const workouts = useSelector(({done})=>done.workouts);
  const dispatch = useDispatch();
  const startWorkout = ()=>{
    setAll(false);
    dispatch(nextBlock());
  }
  return (
    <>
    {
      workouts.current.blocks.map( (block,index)=>(
        block.note&&(
          <div className="block" key={index}>
            <BlockSection block={block} renderLine={renderLine} index={index}/>
          </div>
        )
      ))
    }
    <div className="actions">
      <button className="previous" onClick={()=>setAll(false)}>Regresar</button>
      <button className="next" onClick={startWorkout}>Iniciar Workout</button>
    </div>
  </>
)}
export default Blocks;
