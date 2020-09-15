import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { ProgressBar } from 'react-bootstrap';
import Avatar from "../components/Avatar";
import QuickStatsChart from "../../../widgets/QuickStatsChart";
import { $findPublished } from "../../../../modules/subscription/benchmark";
import { findObjective } from "./Profile/Objective";
import DetailModal from "./Profile/Dialogs/Detail";
import SectionEditWeight from "../DashboardPage/SectionEditWeight";
import SectionChangeGoal from "../DashboardPage/SectionChangeGoal";

const RightBar = () => {  
  const file=false;
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const done = useSelector(({ done }) => done);
  const now = (done.workoutCount)/(done.toWorkout)*100;
  const benchmark = useSelector(({ benchmark }) => benchmark);
  const chartOptions = {
    data: benchmark.results.data,
    color: "#bbca43",
    labels: benchmark.results.labels,
    border: 3
  };
  const total = benchmark.published
    .map(item => item.result)
    .reduce((acc, result) => acc + parseInt(result), 0);
  const dispatch = useDispatch();  
  useEffect(()=>{
    if(total===0){
      console.log("published")
      dispatch($findPublished());
    }
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const [show, setShow] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [objective, setObjective] = useState(false);
  const handleClose = ()=>{
    setShow(false);
  }
  const openModal = ()=>{
    setShow(true);
  }
  const handleCloseWeight = ()=>{
    setShowWeight(false);
  }
  const openModalWeight = ()=>{
    setShowWeight(true);
  }
  const handleCloseObjective = ()=>{
    setObjective(false);
  }
  const openModalObjective = ()=>{
    setObjective(true);
  }
  return (  
    <div id="rightbar">
      <div className="wrapper-rightbar">
        <div className="profile-image">
          <div className="avatar" onClick={openModal}>
            <Avatar
              pictureUrls={currentUser.avatarUrls}
              size="xm"
              className={"userAvatar"}
              changeImage={file}
            />
          </div>
          <div className="name">
            <div className="username" onClick={openModal}>{currentUser.customer.first_name} {currentUser.customer.last_name}</div>
            <div className="level">
              <NavLink className="" to="/level">
                Nivel Físico {currentUser.customer.current_condition}
              </NavLink>
            </div>
            <div className="objective-label" onClick={openModalObjective}>Objetivo</div>
            <div className="objective-value" onClick={openModalObjective}>{findObjective(currentUser.customer.objective, currentUser)}</div>
          </div>
        </div>
        <div className="imc row">
          <div className="col-4"  onClick={openModal}>
            <div className="value">{parseInt(currentUser.customer.current_height)}
            <span className="unit">{currentUser.customer.current_height_unit}</span></div>
            <div className="label">Altura</div>
          </div>
          <div className="col-4"  onClick={openModalWeight}>
            <div className="value">{parseInt(currentUser.customer.current_weight)}
            <span className="unit">{currentUser.customer.current_weight_unit}</span></div>
            <div className="label">Peso</div>
          </div>
          <div className="col-4"  onClick={openModalWeight}>
            <div className="value">{currentUser.customer.imc}</div>
            <div className="label">IMC</div>
          </div>
        </div>
        <div className="workout">
          <h3 className="">Workouts</h3>
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {done.toWorkoutImage&&(
                <img src={done.toWorkoutImage} alt="workout-medal"/>
              )}
            </div>
            <div className="progress-bar-body">
              <span>{done.workoutCount}/{done.toWorkout}</span>
              <ProgressBar now={now} />
            </div>
          </div>
        </div>
        <div className="workout-progress">
          <QuickStatsChart
            value={total}
            desc="Progreso"
            data={chartOptions.data}
            labels={chartOptions.labels}
            color={chartOptions.color}
            border={chartOptions.border}
          />
        </div>
      </div>
      <DetailModal show={show} handleClose={handleClose}/>
      <SectionEditWeight handleClose={handleCloseWeight} show={showWeight} />
      <SectionChangeGoal handleClose={handleCloseObjective} show={objective}/>
    </div>
    )  
}  
export default RightBar;