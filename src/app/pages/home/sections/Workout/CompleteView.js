import React from "react";
import { useSelector } from "react-redux";

const CompleteView = ({onClose})=>{
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
  if(workouts.current.read)onClose();
  return (
    <div className="block">
      {renderImage(workouts.current.blocks[0].image_path)}
      <h2 className="text-center mt-1 mb-2">¡Grandioso!</h2>
      <h2 className="text-center mt-1">Haz completado tu workout del día</h2>
      <div className="actions mt-5">
        <button className="btn btn-primary" style={{margin:"auto"}} onClick={onClose}>Aceptar</button>
      </div>
    </div>
  )
}
export default CompleteView;