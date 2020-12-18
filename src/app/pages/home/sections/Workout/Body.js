import React,{useState} from "react";
import { useSelector } from "react-redux";
import ModalVideo from 'react-modal-video';
import 'react-modal-video/scss/modal-video.scss';

import SectionNote from '../../DashboardPage/SectionNote';
import { http } from "../../services/api";
import Blog from "./Blog";
import Blocks from "./Blocks";
import Block from "./Block";

const Body = ()=>{
  const workout = process.env.REACT_APP_WORKOUT;
  const [show,setShow] = useState(false);
  const [vid,setVid] = useState(false);
  const [all,setAll] = useState(false);
  const workouts = useSelector(({done})=>done.workouts);
  const step  = useSelector(({done})=>done.step);
  const renderLine = (line,index)=>{
    switch(line.tag){
      case 'h1':
        return <h1 key={index}>{line.content}</h1>;
      case 'h2':
        return <h2 key={index}>{line.content}</h2>;
      case 'modal':
        return <SectionNote key={index} line={line} />;
      case 'p':
        return <p key={index}>
          {line.before_content}&nbsp;
          {line.youtube&&(
            <button onClick={()=>{
                setVid(line.youtube.vid);
                setShow(true);
                http({
                  method: "POST",
                  app: "user",
                  path: "customers/activity",
                  data:{
                    column:'video_count'
                  }
                });                                
              }
            }>
              {line.youtube.name}
            </button>
          )}
          {line.after_content}
          </p>;
      default:
    }
  }
  return (
    <div className="workout-body">
    {
      workouts&&workouts.current&&(
        workouts.current.blog?(
          <Blog renderLine={renderLine}/>
        ):(
          all?(
            <Blocks renderLine={renderLine} setAll={setAll}/>
          ):(
            workouts.current.blocks.map( (block,index)=>(
              step===index&&(
                <Block key={index} 
                  block={block} 
                  renderLine={renderLine} 
                  setAll={setAll}
                />
              )                    
            )
          ))
        )
      )
    }
    {workout === 'update'?
    <ModalVideo channel='youtube' isOpen={show} videoId={vid} onClose={() => setShow(false)} />
    :<>
    
    </>}
  </div>
)}
export default Body;
