import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar } from 'react-bootstrap';
import Avatar from "../components/Avatar";
import { $findPublished } from "../../../../modules/subscription/benchmark";
import { findCustomer, setItemValue } from "../redux/people/actions"
import { matchPath } from "react-router-dom";
import DetailModal from "../sections/Profile/Dialogs/Detail";
import SectionEditWeight from "../DashboardPage/SectionEditWeight";
import SectionChangeGoal from "../DashboardPage/SectionChangeGoal";
import ProfileDropdown from "../social/sections/ProfileDropdown";
import FollowButton from "../social/sections/FollowButton";

const SideBar = () => {  
  const file=false;
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const customer = useSelector(({people})=>people.customer);
  const done = useSelector(({ done }) => done);
  const now = (done.workoutCount)/(done.toWorkout)*100;
  const benchmark = useSelector(({ benchmark }) => benchmark);
  const total = benchmark.published
    .map(item => item.result)
    .reduce((acc, result) => acc + parseInt(result), 0);
  const dispatch = useDispatch();  
  const match = matchPath(window.location.pathname, {
    path:'/customers/:id',
    exact:true,
    strict:true
  });  
  useEffect(()=>{
    if(total===0){
      console.log("published")
      dispatch($findPublished());
    }
    if(match&&match.params){
      dispatch(findCustomer(match.params.id));
    }else{
      dispatch(setItemValue({name:'customer',value:false}));
    }
    // dispatch(findUserDetails());
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
          {customer?
            <div className="avatar">
              <Avatar
                pictureUrls={customer.avatarUrls}
                size="xm"
                className={"userAvatar"}
              />
            </div>
            :
            <div className="avatar" onClick={openModal}>
              <Avatar
                pictureUrls={currentUser.avatarUrls}
                size="xm"
                className={"userAvatar"}
                changeImage={file}
              />
            </div>
          }
        </div>
        {customer?
          <div className="profile-info">
            <div className="full-name">{customer.first_name} {customer.last_name}</div>
            <div className="username">@{customer.username}</div>
            <div className="summary">{customer.description}</div>
          </div>
          :
          <div className="profile-info">
            <div className="full-name" onClick={openModal}>{currentUser.customer.first_name} {currentUser.customer.last_name}</div>
            <div className="username">@{currentUser.customer.username}</div>
            <div className="summary">{currentUser.customer.description}</div>
          </div>
        }
        <div className="social-info row">
          <div className="col-4">
            <div className="value">{customer?customer.followings&&customer.followings.length:currentUser.customer.followings&&currentUser.customer.followings.length}
            </div>
            <div className="label">Following</div>
          </div>
          <div className="col-4">
            <div className="value">{customer?customer.followers&&customer.followers.length:currentUser.customer.followers&&currentUser.customer.followers.length}
            {/* <span className="unit">K</span> */}
            </div>
            <div className="label">Followers</div>
          </div>
          <div className="col-4">
            <div className="value">{customer?customer.postCount:currentUser.customer.postCount}</div>
            <div className="label">Posts</div>
          </div>
        </div>
        <div className="actions">
        {customer?
          <>
            <FollowButton customer={customer} />
            <button className="btn btn-custom-secondary">
              Message
            </button>
            <ProfileDropdown />
          </>
          :
          <>
            <button className="btn btn-custom-secondary" onClick={openModal}>
              Editar Perfil
            </button>
            <button className="btn btn-custom-secondary">
              Configuración
            </button>
          </>
        }
        </div>
        <div className="workout">
          <h3 className="mb-4">Entrenamiento</h3>
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {customer?
                done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="workout-medal"/>
                )
                :
                done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="workout-medal"/>
                )
              }
            </div>
            <div className="progress-bar-body">
              <span className="label">Bodyweight Fitness</span>
              {customer?<>
                <span className="value">{customer.current_condition}/5</span>
                <ProgressBar now={customer.current_condition/5*100} />
              </>:<>
                <span className="value">{currentUser.customer.current_condition}/5</span>
                <ProgressBar now={currentUser.customer.current_condition/5*100} />
              </>}
            </div>
          </div>          
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {customer?
                done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="workout-medal"/>
                )
                :
                done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="workout-medal"/>
                )
              }
            </div>
            <div className="progress-bar-body">
              <span className="label">Workout Totales</span>
              {customer?
                <>
                  <span className="value">{done.workoutCount}/{done.toWorkout}</span>
                  <ProgressBar now={now} />
                </>
                :
                <>
                  <span className="value">{done.workoutCount}/{done.toWorkout}</span>
                  <ProgressBar now={now} />
                </>
              }  
            </div>
          </div>
          <div className="progress-bar-wrapper">
            <div className="medal-image">
              {customer?
                done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="workout-medal"/>
                )
                :
                done.toWorkoutImage&&(
                  <img src={done.toWorkoutImage} alt="workout-medal"/>
                )
              }
            </div>
            <div className="progress-bar-body">
              <span className="label">Completados Nov.</span>
              {customer?
                <>
                  <span className="value">{done.workoutCount}/{done.toWorkout}</span>
                  <ProgressBar now={now} />
                </>
                :
                <>
                  <span className="value">{done.workoutCount}/{done.toWorkout}</span>
                  <ProgressBar now={now} />
                </>
              }
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