import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Rating from '@material-ui/lab/Rating';
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { submitSurvey } from "../../redux/done/actions";

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = {
      id: "LogInForm.Error.Email.required"
    };
  }else if (!/.+@.+/.test(values.email)) {
    errors.email = { id: "LogInForm.Error.Email.invalid" };
  }
  return errors;
};
const SurveyItem = ({item, handleChange, error})=>{
  const handleLevelChange = (event, newValue)=>{
    handleChange(item.id, newValue,'level');
  }
  const handleTextChange = (event)=>{
    handleChange(item.id, event.target.value,'text');
  }
  const handleSelectChange = (id)=>{
    handleChange(item.id, id,'select');
  }
  return (
    <Form.Group>
      <Form.Label>
        {item.label}
      </Form.Label>
      {item.question == 'level'&&(
        <div id={`level${item.id}`} className={classnames({"rating-error":error})}>
          <Rating name={`qualityLevel${item.id}`} size="large" value={item.report} onChange={handleLevelChange}/>
        </div>
      )}
      {item.question == 'text'&&(
        <>
          <Form.Control size="lg" type="text" value={item.report} onChange={handleTextChange} isInvalid={error}/>
        </>
      )}
      {item.question == 'select' && (
        item.options.map(option=>(
          <Form.Check
            label={option.option_label}
            key={option.id}
            value={option.id}
            onChange={()=>handleSelectChange(option.id)} 
            checked={option.id==item.report}
            isInvalid={error}
            type="radio"
          />
        ))
      )}
    </Form.Group>
  )
}
const SurveyModal = ({show, handleClose, survey}) => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const dispatch = useDispatch();
  const [items,setItems] = useState([]);
  const [errors,setErrors] = useState([]);
  useEffect(()=>{
    const surveyItems = survey.items.map( item =>{
      if(item.question == 'level')item.report=0;
      else item.report="";
      return item;
    })
    setItems(surveyItems);
  },[]);
  const handleConfirm = ()=>{
    const validate = changeErrors();
    if(validate===false){
      dispatch(submitSurvey({items}));
    }
    return false;
  }
  const changeErrors = ()=>{
    const surveyErrors = survey.items.map( item =>{
      if(item.question == 'level' ){
        if(item.report==0)return true;
        return false;
      }
      else {
        if(item.report=="") return true;
        return false;
      }
    })
    setErrors(surveyErrors);
    const validate = surveyErrors.some(error=>error);
    return validate;
  }
  const handleChange = (id, level,type)=>{
    //let surveyItems = [...items];
    const surveyItems = items.map((item)=>{
      if(item.id == id)item.report = level;
      return item;
    });
    setItems(surveyItems);
    changeErrors();
  }
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      className="surveys"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          {survey.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <div className="questions">
            {items.map((item, index)=>(
              <SurveyItem error={errors[index]} item={item} key={item.id} handleChange={handleChange}/>
            ))}
          </div>
          <Button
            type="button"
            onClick={handleConfirm}
            className="fs-btn"
            style={{ margin: "10px auto", fontSize: "17px", width: "auto" }}
          >
            Cambiar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SurveyModal;
