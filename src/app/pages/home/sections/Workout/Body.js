import React,{useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalVideo from 'react-modal-video';
import 'react-modal-video/scss/modal-video.scss';

import SectionNote from '../../DashboardPage/SectionNote';
import { http } from "../../services/api";
import Blog from "./Blog";
import Blocks from "./Blocks";
import Block from "./Block";
import ModalView from "./ModalView";
import CreatePostModal from "../../social/posts/CreatingModal";
import { initialModalBlock, convertContent,convertVideo,setVideo,  confirmModalNo, confirmModalYes } from "../../redux/workout/actions";

const Body = ()=>{
  const workout = process.env.REACT_APP_WORKOUT;
  const [show,setShow] = useState(false);
  const [vid,setVid] = useState(false);
  const [all,setAll] = useState(false);
  const workouts = useSelector(({done})=>done.workouts);
  const step  = useSelector(({done})=>done.step);
  const dispatch = useDispatch();
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
          {line.video&&(
            <button onClick={()=>{
                dispatch(convertVideo());
                dispatch(setVideo(line.video));
                dispatch(confirmModalNo());
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
              {line.video.name}
            </button>
          )}          
          {line.after_content}
          </p>;
      default:
    }
  }
  const openModal = ()=>{
    setShow(true);
    dispatch(confirmModalYes());
    dispatch(initialModalBlock());
  }
  /** from workout to create post */
  const [showCreatingPost, setShowCreatingPost] = useState(false);
  const onOpenPostModal = () =>{
    console.log('onOpenPostModal')
    setShow(false);
    if(!workouts.current.hasPost)setShowCreatingPost(true);
  }
  const handleCreatingModalClose = () => {
    setShowCreatingPost(false);
  }
  return (
    <div className="workout-body">
    {
      workouts&&workouts.current&&
        <>
          {workouts.current.blog?(
            <Blog renderLine={renderLine}/>
          ):(
            all?(
              <Blocks renderLine={renderLine} setAll={setAll} handleOpen = {openModal}/>
            ):(
              (workout !== 'update')?
                <>{workouts.current.blocks &&workouts.current.blocks.map( (block,index)=>(
                  step===index&&(
                    <Block key={index} 
                      block={block} 
                      renderLine={renderLine} 
                      setAll={setAll}
                    />
                  )                    
                ))}
                </>
              :
                (workouts.current.blocks && workouts.current.blocks.map( (block,index)=>(
                  step===index&&(
                    <Block key={index} 
                      block={block} 
                      renderLine={renderLine} 
                      handleOpen = {openModal}
                      setAll={setAll}
                    />
                  )                    
                ))
            ))
          )
        }
        {workout === 'update'?(
          <ModalView isOpen={show} step={step} onClose={() => {
            dispatch(convertContent());
            setShow(false)
          }} onOpenPost={onOpenPostModal}/>
        ):(
          <ModalVideo channel='youtube' isOpen={show} videoId={vid} onClose={() => setShow(false)}/>
        )}
        {workouts&&workouts.current&&<CreatePostModal show={showCreatingPost} handleClose={handleCreatingModalClose} workout={workouts.current}/>}
      </>
    }
  </div>
)}
export default Body;
