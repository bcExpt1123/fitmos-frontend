import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import {Modal, Form, Button } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { findWorkouts,initialBlock,doneQuestion,stopRunning } from "../../redux/done/actions";
import SurveyModal from "./SurveyModal";
import MemberModalComponent from '../../ExplorePage/Member/ModalComponent';

const Header = ()=>{
  const dispatch = useDispatch();
  const clickDate = (date)=>{
    dispatch(findWorkouts(date));
    dispatch(initialBlock());
  }
  const workouts = useSelector(({done})=>done.workouts);
  const isRunning = useSelector(({done})=>done.isRunning);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const survey = useSelector(({done})=>done.survey);
  const [show, setShow] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [question, setQuestion] = useState('recommend');
  const changeConfirm = ()=>{
    if(isRunning){
      if(window.confirm("El reloj aún sigue corriendo. ¿Deseas avanzar?") ===false)return false;
      dispatch(stopRunning());
    }
    return true;
  }
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
  const goBackIntroduction = ()=>{
    if(changeConfirm())dispatch(initialBlock());
  }
  useEffect(()=>{
    if(currentUser.customer.qbligatory_question == null)setShow(true);
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if(survey&&survey.id&&show===false)setShowSurvey(true);
  },[survey]);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="workout-header">
      <b style={{fontSize:"21px"}}>Workout del día</b>
      {
        workouts&&workouts.current&&(
          workouts.current.read?(
            <SVG src={toAbsoluteUrl("/media/icons/svg/Mark/checked.svg")} className="ml-2 ml-md-5 mr-md-5 mb-2" style={{width:"25px",height:"25px"}}/>
          ):(
            <SVG src={toAbsoluteUrl("/media/icons/svg/Mark/unchecked.svg")} className="ml-2 ml-md-5 mr-md-5 mb-2" style={{width:"25px",height:"25px"}}/>
          )
        )
      }
      <div style={{float:"right"}}>
        {workouts&&(workouts.previous?(
          <>
            <span className="active" onClick={()=>{if(changeConfirm())clickDate(workouts.previous.today)}}> <i className="fas fa-angle-left"></i> </span>
            <span className="mobile-full-screen" onClick={goBackIntroduction}> <i className="fas fa-angle-left"></i> </span>
          </>
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
          <span className="active" onClick={()=>{if(changeConfirm())clickDate(workouts.next.today)}}> <i className="fas fa-angle-right"></i> </span>
        ):(
          <span> <i className="fas fa-angle-right"></i> </span>
        ))}
      </div>
      {currentUser&&(
        <Modal
          show={show}
          className="qbligatory-question-modal"
          onHide={handleHide}
          animation={false}
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-center w-100">
              ¡Bienvenido a Fitemos!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentUser.customer.qbligatory_question==null&&(
              <>
              <h2>¿Cómo nos conociste?</h2>
              <Form>
                <Form.Group>
                  <Form.Check 
                    type={'radio'}
                    id={`recommend`}
                    label={`Me lo recomendaron`}
                    onChange={handleOptionChange}
                    value="recommend"
                    checked={question === "recommend"}
                  />
                  <Form.Check 
                    type={'radio'}
                    id={`advertisea`}
                    label={`Me llegó la publicidad`}
                    onChange={handleOptionChange}
                    value="advertise"
                    checked={question === "advertise"}
                  />
                  <Form.Check 
                    type={'radio'}
                    id={`long`}
                    label={`Los conozco hace un tiempo`}
                    onChange={handleOptionChange}
                    value="long"
                    checked={question === "long"}
                  />
                </Form.Group>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  className="blue-btn"
                  style={{ margin: "10px auto", fontSize: "17px", width: "auto" }}
                >
                  Aceptar
                </Button>
                </Form>
              </>
            )}
            <MemberModalComponent />
          </Modal.Body>
        </Modal>
      )
      }
      {survey&&show===false&&(
        <SurveyModal show={showSurvey}  handleClose={handleSurveyHide} survey={survey}/>
      )}
    </div>
  )}
export default Header;
