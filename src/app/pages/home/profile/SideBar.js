import React,{useState,useEffect, useRef} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar } from 'react-bootstrap';
import { matchPath, useHistory } from "react-router-dom";
import Sticky from "wil-react-sticky";
import Avatar from "../components/Avatar";
import { $findPublished } from "../../../../modules/subscription/benchmark";
import { findCustomer, setItemValue } from "../redux/people/actions"
import DetailModal from "../sections/Profile/Dialogs/Detail";
import SectionEditWeight from "../DashboardPage/SectionEditWeight";
import SectionChangeGoal from "../DashboardPage/SectionChangeGoal";
import ProfileDropdown from "../social/sections/ProfileDropdown";
import FollowButton from "../social/sections/FollowButton";
import ReadMore from '../components/ReadMore';

const SideBar = () => {  
  const file=false;
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const customer = useSelector(({people})=>people.username);
  
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
  const history = useHistory();
  const redirectProfile = ()=>{
    history.push('/'+ currentUser.customer.username);
  }
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
  const check = ()=>{
    return customer!="username" && customer.type==="customer";
  }
  const summaryRef = useRef();
  const getWrapperWidth= ()=>{
    if (summaryRef) {
      // console.log('get wrapper width', window.getComputedStyle(summaryRef.current).getPropertyValue('width'));
    } else {
      console.log('get wrapper - no wrapper');
    }
  }
  return (  
    <div id="sidebar">
      <Sticky offsetTop={130}>
        <div className="wrapper-side">
          <div className="profile-image">
            {check()?
              <div className="avatar">
                <Avatar
                  pictureUrls={customer.avatarUrls}
                  size="xm"
                  className={"userAvatar"}
                />
              </div>
              :
              <div className="avatar" onClick={redirectProfile}>
                <Avatar
                  pictureUrls={currentUser.avatarUrls}
                  size="xm"
                  className={"userAvatar"}
                  changeImage={file}
                />
              </div>
            }
          </div>
          {check()?
            <div className="profile-info">
              <div className="full-name">{customer.first_name} {customer.last_name}</div>
              <div className="username">@{customer.username}</div>
              <div className="summary">
                {customer.description&&
                  <ReadMore 
                    text={customer.description}
                    numberOfLines={4}
                    lineHeight={1}
                    showLessButton={true}
                    onContentChange={getWrapperWidth}
                  />
                }
                {(currentUser.customer.id === customer.id &&customer.description==null)&&<>Enter something about you…</>}
              </div>
            </div>
            :
            <div className="profile-info">
              <div className="full-name cursor-pointer" onClick={redirectProfile}>{currentUser.customer.first_name} {currentUser.customer.last_name}</div>
              <div className="username" onClick={redirectProfile}>@{currentUser.customer.username}</div>
              <div className="summary" ref={summaryRef}>
                {currentUser.customer.description?
                  <ReadMore 
                    text={currentUser.customer.description}
                    numberOfLines={4}
                    lineHeight={1}
                    showLessButton={true}
                    onContentChange={getWrapperWidth}
                  />
                  :<>Enter something about you…</>
                }
              </div>
            </div>
          }
          <div className="social-info row">
            <div className="col-4">
              <div className="value">{check()?customer.followings&&customer.followings.length:currentUser.customer.followings&&currentUser.customer.followings.length}
              </div>
              <div className="label">Following</div>
            </div>
            <div className="col-4">
              <div className="value">{check()?customer.followers&&customer.followers.length:currentUser.customer.followers&&currentUser.customer.followers.length}
              {/* <span className="unit">K</span> */}
              </div>
              <div className="label">Followers</div>
            </div>
            <div className="col-4">
              <div className="value">{check()?customer.postCount:currentUser.customer.postCount}</div>
              <div className="label">Posts</div>
            </div>
          </div>
          <div className="actions">
          {(check() && customer.id !== currentUser.customer.id)?
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
                Editar<span style={{width:"15.4px",display:"inline-block"}}>&nbsp;&nbsp;&nbsp;</span>Perfil
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
                {check()?
                  customer.medals.levelMedalImage&&(
                    <img src={customer.medals.levelMedalImage} alt="workout-medal"/>
                  )
                  :
                  done.levelMedalImage&&(
                    <img src={done.levelMedalImage} alt="workout-medal"/>
                  )
                }
              </div>
              <div className="progress-bar-body">
                <span className="label">Bodyweight Fitness</span>
                {check()?<>
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
                {check()?
                  customer.medals.toWorkoutImage&&(
                    <img src={customer.medals.toWorkoutImage} alt="workout-medal"/>
                  )
                  :
                  done.toWorkoutImage&&(
                    <img src={done.toWorkoutImage} alt="workout-medal"/>
                  )
                }
              </div>
              <div className="progress-bar-body">
                <span className="label">Workout Totales</span>
                {check()?
                  <>
                    <span className="value">{customer.medals.workoutCount}/{customer.medals.toWorkout}</span>
                    <ProgressBar now={customer.medals.workoutCount/customer.medals.toWorkout*100} />
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
                {check()?
                  customer.medals.toMonthWorkout&&(
                    <img src={customer.medals.toMonthWorkoutImage} alt="workout-medal"/>
                  )
                  :
                  done.toMonthWorkout&&(
                    <img src={done.toMonthWorkoutImage} alt="workout-medal"/>
                  )
                }
              </div>
              <div className="progress-bar-body">
                <span className="label">Completados Nov.</span>
                {check()?
                  <>
                    <span className="value">{customer.medals.monthWorkoutCount}/{customer.medals.monthWorkoutTotal}</span>
                    <ProgressBar now={customer.medals.monthPercent} />
                  </>
                  :
                  <>
                    <span className="value">{done.monthWorkoutCount}/{done.monthWorkoutTotal}</span>
                    <ProgressBar now={done.monthPercent} />
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </Sticky>
      <DetailModal show={show} handleClose={handleClose}/>
      <SectionEditWeight handleClose={handleCloseWeight} show={showWeight} />
      <SectionChangeGoal handleClose={handleCloseObjective} show={objective}/>
    </div>
    )  
}  
export default SideBar;