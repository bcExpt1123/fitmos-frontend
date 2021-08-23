import React,{useState,useEffect, useRef} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { ProgressBar } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import Avatar from "../components/Avatar";
import { $findPublished } from "../../../../modules/subscription/benchmark";
import DetailModal from "../sections/Profile/Dialogs/Detail";
import ProfileDropdown from "../social/sections/ProfileDropdown";
import FollowButton from "../social/sections/FollowButton";
import ReadMore from '../components/ReadMore';
import FollowingListModal from './FollowingListModal';
import OpenPrivateMessageButton from './components/OpenPrivateMessage';
import DumbellsWeightModal from './components/DumbellsWeightModal';
const caculatePercent = customer =>{
  const dumbellsWeight = customer.dumbells_weight?customer.dumbells_weight:0;
  let rate = 0;
  if(customer.gender === 'Male'){
    rate = parseInt(dumbellsWeight * 2);
  }else{
    rate = parseInt(dumbellsWeight * 100/35);
  }
  if(rate>100){
    return 100;
  }else if( rate < 0){
    return 0;
  }
  return rate;
}
const ProfileInfo = ({customer}) => {  
  const file=false;
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const done = useSelector(({ done }) => done);
  const now = (done.workoutCount)/(done.toWorkout)*100;
  const benchmark = useSelector(({ benchmark }) => benchmark);
  const total = benchmark.published
    .map(item => item.result)
    .reduce((acc, result) => acc + parseInt(result), 0);
  const dispatch = useDispatch();  
  useEffect(()=>{
    if(total===0){
      dispatch($findPublished());
    }
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if(currentUser.customer && currentUser.customer.weights === 'con pesas' && currentUser.customer.dumbells_weight===null){
      setDumbellsModalShow(true);
    }
  },[currentUser.customer && currentUser.customer.weights]);// eslint-disable-line react-hooks/exhaustive-deps
  const history = useHistory();
  const redirectProfile = ()=>{
    history.push('/'+ currentUser.customer.username);
  }
  const [show, setShow] = useState(false);
  const openModal = ()=>{
    if(currentUser.type==="customer")setShow(true);
  }
  const handleClose = ()=>{
    setShow(false);
  }
  const redirectEditAccountPage = ()=>{
    if(currentUser.type==="customer")history.push('/profile');
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
  /**following modal */
  const [followingModalShow, setFollowingModalShow] = useState(false);
  const [tabKey, setTabKey] = useState("followings");
  const openFollowingModal = (key)=>()=>{
    setFollowingModalShow(true);
    setTabKey(key);
  }
  const handleFollowingListClose = ()=>{
    setFollowingModalShow(false);
  }
  const [dumbellsModalShow,setDumbellsModalShow] = useState(false);
  const openDumbellsModal = ()=>{
    setDumbellsModalShow(true);
  }
  const closeDumbellsModal = ()=>{
    setDumbellsModalShow(false);
  }
  
  return (  
    <>
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
              {customer.description!=='null'&&customer.description&&
                <ReadMore 
                  text={customer.description}
                  numberOfLines={8}
                  lineHeight={1}
                  showLessButton={true}
                  onContentChange={getWrapperWidth}
                />
              }
              {(currentUser.type==="customer" && currentUser.customer.id === customer.id &&customer.description==null)&&<>Escribe algo sobre ti…</>}
            </div>
          </div>
          :
          <div className="profile-info">
            <div className="full-name cursor-pointer" onClick={redirectProfile}>{currentUser.customer.first_name} {currentUser.customer.last_name}</div>
            <div className="username" onClick={redirectProfile}>@{currentUser.customer.username}</div>
            <div className="summary" ref={summaryRef}>
              {customer.description!=='null'&&currentUser.customer.description?
                <ReadMore 
                  text={currentUser.customer.description}
                  numberOfLines={4}
                  lineHeight={1}
                  showLessButton={true}
                  onContentChange={getWrapperWidth}
                />
                :<>Escribe algo sobre ti…</>
              }
            </div>
          </div>
        }
        <div className="social-info row">
          <div className="col-4" onClick={openFollowingModal("followers")}>
            <div className="value">{check()?customer.medals.workoutCount:done.workoutCount}
            {/* <span className="unit">K</span> */}
            </div>
            <div className="label">Workouts</div>
          </div>
          <div className="col-4" onClick={openFollowingModal("followings")}>
            <div className="value">{check()?customer.followings&&customer.followings.length:currentUser.customer.followings&&currentUser.customer.followings.length}
            </div>
            <div className="label">Partners</div>
          </div>
          <div className="col-4">
            <div className="value">{check()?customer.postCount:currentUser.customer.postCount}</div>
            <div className="label">Posts</div>
          </div>
        </div>
        <div className="actions">
        {(check() && customer.type==="customer" && (currentUser.customer===null ||  customer.id !== currentUser.customer.id))?
          <>
            {currentUser.customer!==null && <FollowButton customer={customer} />}
            {currentUser.customer!==null && <OpenPrivateMessageButton customer={customer}/>}
            {currentUser.customer!==null && <ProfileDropdown />}
          </>
          :
          <>
            <button className="btn btn-custom-secondary" onClick={openModal}>
              <span style={{width:"5.5px",display:"inline-block"}}>&nbsp;</span>
              Editar<span style={{width:"4.4px",display:"inline-block"}}>&nbsp;</span>Perfil
              <span style={{width:"5.5px",display:"inline-block"}}>&nbsp;</span>
            </button>
            <button className="btn btn-custom-secondary"onClick={redirectEditAccountPage}>
              Configuración
            </button>
          </>
        }
        </div>
        {((customer.is_manager === false && customer!="username" && customer.type==="customer")
          ||
          (currentUser.customer && currentUser.customer.is_manager === false && customer.type===undefined && currentUser.customer.id === customer.id)) && (
          <div className="workout">
            <h3 className="mb-4">Entrenamiento</h3>
            <div className="progress-bar-wrapper">
              {/* <div className="medal-image">
                {check()?
                  customer.medals.levelMedalImage&&(
                    <img src={customer.medals.levelMedalImage} alt="workout-medal"/>
                  )
                  :
                  done.levelMedalImage&&(
                    <img src={done.levelMedalImage} alt="workout-medal"/>
                  )
                }
              </div> */}
              {check()?
                <div className="progress-bar-body">
                  <span className="label">Nivel</span>
                  <span className="value">{customer.current_condition}/5</span>
                  <ProgressBar now={customer.current_condition/5*100} />
                </div>
              :
                <div className="progress-bar-body cursor-pointer"  onClick={()=>history.push('/level')}>
                  <span className="label">Nivel</span>
                  <span className="value">{currentUser.customer.current_condition}/5</span>
                  <ProgressBar now={currentUser.customer.current_condition/5*100} />
                </div>
              }
            </div>          
            <div className="progress-bar-wrapper">
              {/* <div className="medal-image">
                {check()?
                  customer.medals.toWorkoutImage&&(
                    <img src={customer.medals.toWorkoutImage} alt="workout-medal"/>
                  )
                  :
                  done.toWorkoutImage&&(
                    <img src={done.toWorkoutImage} alt="workout-medal"/>
                  )
                }
              </div> */}
              <div className="progress-bar-body">
                <span className="label">Rango</span>
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
            {check()?
              customer.weights === 'con pesas' && (
                <div className="progress-bar-wrapper">
                  {/* <div className="medal-image">
                    {customer.medals.toMonthWorkoutImage&&(
                        <img src={customer.medals.toMonthWorkoutImage} alt="workout-medal"/>
                    )}
                  </div> */}
                  <div className="progress-bar-body">
                    <span className="label">Peso</span>
                    <span className="value">{caculatePercent(customer)}%</span>
                    <ProgressBar now={caculatePercent(customer)} />
                  </div>
                </div>
              )  
              :
              currentUser.customer.weights === 'con pesas' && (
                <div className="progress-bar-wrapper">
                  {/* <div className="medal-image">
                    {done.toMonthWorkoutImage&&(
                      <img src={done.toMonthWorkoutImage} alt="workout-medal"/>
                    )}
                  </div> */}
                  <div className="progress-bar-body cursor-pointer"  onClick={openDumbellsModal}>
                    <span className="label">Peso</span>
                    <span className="value">{caculatePercent(currentUser.customer)}%</span>
                    <ProgressBar now={caculatePercent(currentUser.customer)} />
                  </div>
                </div>
              )
            }
          </div>          
        )} 
      </div>
      {currentUser.type==="customer" && <DetailModal show={show} handleClose={handleClose}/>}
      {followingModalShow && <FollowingListModal show={followingModalShow}  onClose={handleFollowingListClose} tabKey={tabKey} customer={customer}/>}
      {dumbellsModalShow && <DumbellsWeightModal show={dumbellsModalShow} onClose={closeDumbellsModal}/>}
    </>
  )  
}  
export default ProfileInfo;