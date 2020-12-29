import React, {useState, useEffect} from "react";
import { Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { triggerWorkout, triggerNotifiable } from "../../redux/userSettings/actions";

const Email = () => {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const regenerateCompleted = useSelector(({ auth }) => auth.regenerateCompleted);
  const [workout, setWorkout] = useState(currentUser.customer.active_email);
  const [notifiable, setNotifiable] = useState(currentUser.customer.notifiable);
  const [property, setProperty] = useState(false);
  useEffect( ()=>{
    if(regenerateCompleted===true){
      switch(property){
        case 'workout':
          //setWorkout(currentUser.customer.active_email);
          break;
        case 'notifiable':
          //setNotifiable(currentUser.customer.notifiable);
          break;
        default:  
      }
    }
  },[regenerateCompleted]);// eslint-disable-line react-hooks/exhaustive-deps
  const dispatch = useDispatch();
  const onTriggerWorkout = ()=>{
    setProperty('workout'); 
    if(workout==='1')setWorkout('0');
    else setWorkout('1');
    dispatch(triggerWorkout());
    setTimeout(()=>{
      if(currentUser.customer.active_email!==workout)setWorkout(currentUser.customer.active_email);
    },10000);
  }
  const onTriggerNotifiable = ()=>{
    setProperty('notifiable');
    if(notifiable==='1')setNotifiable('0');
    else setNotifiable('1');
    dispatch(triggerNotifiable());
    setTimeout(()=>{
      if(currentUser.customer.notifiable!==notifiable)setNotifiable(currentUser.customer.notifiable);
    },10000);
}
  return (
    <Card>
      <Card.Header>
        <Card.Title>Emails</Card.Title>
      </Card.Header>
      <Card.Body>
        <label>Workouts</label>
        <div className="row">
          <div className="value col-6 mt-3">
            {workout==='1'?(
              <>ON</>
            ):(
              <>OFF</>
            )}
          </div>
          <div className="col-6 edit"><input className="apple-switch" type="checkbox" checked={workout==='1'} onChange={onTriggerWorkout}/></div>
        </div>
        <label>Blog y Promociones</label>
        <div className="row">
          <div className="value col-6 mt-3">
            {notifiable==='1'?(
              <>ON</>
            ):(
              <>OFF</>
            )}            
          </div>
          <div className="col-6 edit"><input className="apple-switch" type="checkbox" checked={notifiable==='1'} onChange={onTriggerNotifiable}/></div>
        </div>
      </Card.Body>
    </Card>
  );
};
export default Email;
