import React, {useEffect, useState} from "react";
import classnames from "classnames";
import {  useDispatch,useSelector } from "react-redux";

const CompleteView = ({onClose, openCreatingPost})=>{
  const workouts = useSelector(({done})=>done.workouts);
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
  return (
    <div className="block">
      {renderImage(workouts.current.blocks[0].image_path)}
      <h2 className="text-center mt-1 mb-2">¡Grandioso!</h2>
      <h2 className="text-center mt-1">Haz completado tu workout del día</h2>
      <hr/>
      <div className="actions mt-5">
        <input className="open-create-post-modal" value={"Comparte tu experiencia"} onClick={openCreatingPost}/>
        <button className="btn btn-primary" style={{margin:"auto"}} onClick={onClose}>Aceptar</button>
      </div>
    </div>
  )
}
export default CompleteView;