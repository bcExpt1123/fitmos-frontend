import React,{useState} from "react";
import Card from "react-bootstrap/Card";
import { useSelector,useDispatch } from "react-redux";
import Accordion from "react-bootstrap/Accordion";
import classnames from "classnames";
import { Markup } from "interweave";
import ModalVideo from 'react-modal-video';
import 'react-modal-video/scss/modal-video.scss';
import { http } from "../services/api";
import { doneWorkout} from '../redux/done/actions';
import SectionNote from './SectionNote';

const SectionWorkout = ({}) => {
  const [show,setShow] = useState(false);
  const [vid,setVid] = useState(false);
  const workouts = useSelector(({ benchmark }) => benchmark.workouts);
  const dispatch = useDispatch();
  const handleClick = (item)=>{
    if(!item.read)dispatch(doneWorkout({date:item.today,blog:item.blog}));
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
  return (
    <>
      {workouts && (
        <Accordion defaultActiveKey={0}>
          {workouts.map((item, index) => (
            <Card className="workout"  key={index}>
              <Accordion.Toggle
                as={Card.Header}
                variant="link"
                className={classnames({"workout-checked":item.read})}
                eventKey={index}
              >
                <h3 className="card-title">{item.date}</h3>
                <button onClick={(e)=>{e.stopPropagation();handleClick(item);}} className={classnames("card-subtitle",{checked:item.read})}>{
                  item.blog?(
                    item.read?(
                      'Completado'
                    ):(
                      'Completar'
                    )
                  ):(
                    item.read?(
                      'Completado'
                    ):(
                      'Completar'
                    )
                  )
                }</button>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={index}>
                <Card.Body className="workout-content">
                  {item.dashboard.map((line,index)=>
                    renderLine(line, index)
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
          </Accordion>
        )}
        <ModalVideo channel='youtube' isOpen={show} videoId={vid} onClose={() => setShow(false)} />
      </>
  );
};

const mapDispatchToProps = {};

export default SectionWorkout;
