import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { findWorkouts,initialBlock,doneQuestion } from "../../redux/done/actions";
import SurveyModal from "./SurveyModal";

const Header = ()=>{
  const dispatch = useDispatch();
  const clickDate = (date)=>{
    dispatch(findWorkouts(date));
    dispatch(initialBlock())
  }
  const workouts = useSelector(({done})=>done.workouts);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const survey = useSelector(({done})=>done.survey);
  const [show, setShow] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [question, setQuestion] = useState(false);
  const handleHide = ()=>{
    setShow(false);
    if(survey&&survey.id&&show===false)setShowSurvey(true);
  }
  const handleConfirm = ()=>{
    dispatch(doneQuestion({question}));
  }
  const handleSurveyHide = ()=>{
    setShowSurvey(false);
  }
  const handleOptionChange = (event)=>{
    setQuestion(event.target.value);
  }
  useEffect(()=>{
    if(currentUser.customer.qbligatory_question == null)setShow(true);
  },[]);
  useEffect(()=>{
    if(survey&&survey.id&&show===false)setShowSurvey(true);
  },[survey]);
  return (
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
      {
        workouts&&workouts.current&&(
          workouts.current.read?(
            <SVG src={toAbsoluteUrl("/media/icons/svg/Mark/checked.svg")} style={{float:'right'}}/>
          ):(
            <SVG src={toAbsoluteUrl("/media/icons/svg/Mark/unchecked.svg")} style={{float:'right'}}/>
          )
        )
      }
      {currentUser&&currentUser.customer.qbligatory_question==null&&(
        <Modal
          show={show}
          className="qbligatory-question-modal"
          onHide={handleHide}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100">
              ¿Cómo nos conociste?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Check 
                  type={'radio'}
                  id={`recommend`}
                  label={`Me lo recomendaron`}
                  onChange={handleOptionChange}
                  value="recommend"
                  checked={question == "recommend"}
                />
                <Form.Check 
                  type={'radio'}
                  id={`advertise`}
                  label={`Me llegó la publicidad`}
                  onChange={handleOptionChange}
                  value="advertise"
                  checked={question == "advertise"}
                />
                <Form.Check 
                  type={'radio'}
                  id={`long`}
                  label={`Los conozco hace un tiempo`}
                  onChange={handleOptionChange}
                  value="long"
                  checked={question == "long"}
                />
              </Form.Group>
              <Button
                type="button"
                onClick={handleConfirm}
                className="fs-btn"
                style={{ margin: "10px auto", fontSize: "17px", width: "auto" }}
              >
                Aceptar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )
      }
      {survey&&show==false&&(
        <SurveyModal show={showSurvey}  handleClose={handleSurveyHide} survey={survey}/>
      )}
    </div>
  )}
export default Header;