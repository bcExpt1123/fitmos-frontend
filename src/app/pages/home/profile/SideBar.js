import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { ProgressBar } from 'react-bootstrap';
import Avatar from "../components/Avatar";
import QuickStatsChart from "../../../widgets/QuickStatsChart";
import { $findPublished } from "../../../../modules/subscription/benchmark";
import { findObjective } from "../sections/Profile/Objective";
import { findUserDetails } from "../redux/auth/actions";
import DetailModal from "../sections/Profile/Dialogs/Detail";
import SectionEditWeight from "../DashboardPage/SectionEditWeight";
import SectionChangeGoal from "../DashboardPage/SectionChangeGoal";

const SideBar = () => {  
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
    dispatch(findUserDetails());
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
    <div id="sidebar">
      <div className="wrapper-side">
        <div className="profile-image">
          <div className="avatar" onClick={openModal}>
            <Avatar
              pictureUrls={currentUser.avatarUrls}
              size="xm"
              className={"userAvatar"}
              changeImage={file}
            />
          </div>
        </div>
        <div className="profile-info">
          <div className="full-name" onClick={openModal}>{currentUser.customer.first_name} {currentUser.customer.last_name}</div>
          <div className="username">@{currentUser.customer.username}</div>
          <div className="summary">You will need to include apple sign in at least on an iphone app because due recent updates on their store if you include third party login is required to get approval.</div>
        </div>
        <div className="social-info row">
          <div className="col-4">
            <div className="value">{parseInt(currentUser.customer.current_height)}
            </div>
            <div className="label">Following</div>
          </div>
          <div className="col-4">
            <div className="value">{parseInt(currentUser.customer.current_weight)}
            <span className="unit">K</span></div>
            <div className="label">Followers</div>
          </div>
          <div className="col-4">
            <div className="value">{currentUser.customer.imc}</div>
            <div className="label">Posts</div>
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-custom-secondary">
            Editar Perfil
          </button>
          <button className="btn btn-custom-secondary">
            Configuración
          </button>
        </div>
        <div className="workout">
          <h3 className="mb-4">Entrenamiento</h3>
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {done.toWorkoutImage&&(
                <img src={done.toWorkoutImage} alt="workout-medal"/>
              )}
            </div>
            <div className="progress-bar-body">
              <span className="label">Bodyweight Fitness</span><span className="value">{currentUser.customer.current_condition}/5</span>
              <ProgressBar now={20} />
            </div>
          </div>          
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {done.toWorkoutImage&&(
                <img src={done.toWorkoutImage} alt="workout-medal"/>
              )}
            </div>
            <div className="progress-bar-body">
              <span className="label">Workout Totales</span>
              <span className="value">{done.workoutCount}/{done.toWorkout}</span>
              <ProgressBar now={now} />
            </div>
          </div>
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {done.toWorkoutImage&&(
                <img src={done.toWorkoutImage} alt="workout-medal"/>
              )}
            </div>
            <div className="progress-bar-body">
              <span className="label">Completados Nov.</span>
              <span className="value">{done.workoutCount}/{done.toWorkout}</span>
              <ProgressBar now={now} />
            </div>
          </div>
        </div>
      </div>
      <DetailModal show={show} handleClose={handleClose}/>
      <SectionEditWeight handleClose={handleCloseWeight} show={showWeight} />
      <SectionChangeGoal handleClose={handleCloseObjective} show={objective}/>
    </div>
    )  
}  
export default SideBar;