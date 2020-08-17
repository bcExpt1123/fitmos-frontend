import React,{ useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import classnames from "classnames";
import ModalVideo from 'react-modal-video';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import ThreeColumn from "./layouts/Three";
import { findWorkouts, doneWorkout } from "./redux/done/actions";
import SectionNote from './DashboardPage/SectionNote';
import { http } from "./services/api";
import Timer from "./sections/Workout/Timer";

const WorkoutPage = () => {
  const workouts = useSelector(({done})=>done.workouts);
  const [show,setShow] = useState(false);
  const [vid,setVid] = useState(false);
  const [step,setStep] = useState(0);
  const [all,setAll] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(findWorkouts());
  }, []);
  const clickDate = (date)=>{
    dispatch(findWorkouts(date));
    setStep(0);
  }
  const renderLine = (line,index)=>{
    switch(line.tag){
      case 'h1':
        return <h1 key={index}>{line.content}</h1>;
      break;
      case 'h2':
        return <h2 key={index}>{line.content}</h2>;
      break;
      case 'modal':
        return <SectionNote key={index} line={line} />;
      break;
      case 'p':
        return <p key={index}>
          {line.before_content}&nbsp;
          {line.youtube&&(
            <button onClick={()=>{
                setVid(line.youtube.vid);
                setShow(true);
                const res = http({
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
      break;
    }
  }
  const nextStep = ()=>{
    setStep(step+1);
  }
  const previousStep = ()=>{
    setStep(step-1);
  }
  const handleComplete = (item)=>{
    if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
  }
  //get workout from date
  return (<>
    <MetaTags>
      <title>Workout -Fitemos </title>
      <meta
        name="description"
        content="Workout -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      <header className="page-title">
        <h2>Hola {currentUser.customer.first_name}</h2>
        {
          workouts&&workouts.current&&(
            <div className="sub-title">{workouts.current.date}</div>            
          )
        }
        <div className="tag-line">¡Este Viernes tenemos un anuncio especial!</div>
      </header>
      <div className="workout">
        <div className="workout-header">
          {workouts&&(workouts.previous?(
            <span className="active" onClick={()=>clickDate(workouts.previous.today)}> <i className="fas fa-angle-left"></i> </span>
          ):(
            <span> <i className="fas fa-angle-left"></i> </span>
          ))}
          <span className="workout-date">
          {
            workouts&&workouts.current&&(
              workouts.current.short_date
            )
          }
          </span>
          {workouts&&(workouts.next?(
            <span className="active" onClick={()=>clickDate(workouts.next.today)}> <i className="fas fa-angle-right"></i> </span>
          ):(
            <span> <i className="fas fa-angle-right"></i> </span>
          ))}
        </div>
        <div className="workout-body">
          {
            workouts&&workouts.current&&(
              workouts.current.blog?(
                <div className="blog">
                  {
                    workouts.current.blocks.map( (block,index)=>(
                      block.content&&block.content.map( (render,index1)=>(
                        renderLine(render, index1)
                      ))
                    ))
                  }
                  <div className="actions">
                    <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
                      Completar
                    </button>
                  </div>
                </div>
              ):(
                all?(
                  <>
                    {
                      workouts.current.blocks.map( (block,index)=>(
                        <div className="block" key={index}>
                          {block.image_path&&(
                            <div className="image">
                              <div className="background-container">
                                  <div className="background" 
                                    style={{
                                      backgroundImage: "url(" + block.image_path + ")"
                                    }}
                                  >
                                  </div>
                              </div>
                            </div>                          
                          )}
                          {block.content&&block.content.map( (render,index1)=>(
                            renderLine(render, index1)
                          ))}
                        </div>
                      ))
                    }
                    <div className="actions">
                      <button className="previous" onClick={()=>setAll(false)}>Ver Individual</button>
                      <button onClick={(e)=>{e.stopPropagation();handleComplete(workouts.current);}} className={classnames("next",{checked:workouts.current.read})}>
                        Completar
                      </button>
                    </div>
                  </>
                ):(
                  workouts.current.blocks.map( (block,index)=>(
                    step==index&&(
                      <div className="block" key={index}>
                        {block.image_path&&(
                          <div className="image">
                            <div className="background-container">
                                <div className="background" 
                                  style={{
                                    backgroundImage: "url(" + block.image_path + ")"
                                  }}
                                >
                                </div>
                            </div>
                          </div>                          
                        )}
                        {block.timer_type&&(
                          <Timer type={block.timer_type} work={block.timer_work} round={block.timer_round} rest={block.timer_rest} />
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
                              <Tab eventKey="note" title="Note">
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
                  )
                ))
              )
            )
          }
        </div>
      </div>
    </ThreeColumn>
    <ModalVideo channel='youtube' isOpen={show} videoId={vid} onClose={() => setShow(false)} />
  </>);
};

export default WorkoutPage;
