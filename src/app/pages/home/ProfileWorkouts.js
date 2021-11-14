import React, { useEffect, useState } from "react";
import { useSWRInfinite } from "swr";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import { matchPath, useHistory } from "react-router-dom";
import classnames from 'classnames';
import TwoColumn from "./layouts/Two";
import WorkoutCommentModal from "./social/sections/workout/WorkoutCommentModal";
import { useInfiniteScroll } from "../../../lib/useInfiniteScroll";
import { findUsername } from "./redux/people/actions";
import { httpApi } from "./services/api";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/username-workouts.scss";

const getKey = (pageIndex, previousPageData, username) => {
  if (previousPageData && !previousPageData.data.length) return null // reached the end
  return username?`workout-comments/publish?customer_id=${username.id}&page_number=${pageIndex+1}`:null
}
const ProfileWorkouts = () => {
  const match = matchPath(window.location.pathname, {
    path:['/:username/workouts'],
    exact:true,
    strict:true
  });  
  const dispatch = useDispatch();
  useEffect(()=>{
    if(match&&match.params){
      dispatch(findUsername(match.params.username));
    }
  },[])
  const username = useSelector(({people})=>people.username);
  const { data, size, setSize, isValidating } = useSWRInfinite(
    (...args) => getKey(...args, username), httpApi
  );
  let workouts = [];
  if(data) data.forEach(item=>workouts = workouts.concat(item.data));
  const isRefreshing = isValidating && data && data.length === size  
  const history = useHistory();
  const goBackProfile=()=>{
    const path = window.location.pathname.substring(0, Math.max(window.location.pathname.lastIndexOf("/"), window.location.pathname.lastIndexOf("\\"))); 
    history.push(path);
  }
  const fetchMoreListItems = ()=>{
    console.log('fetchMoreListItems')
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  useEffect(()=>{
    if (isFetching && !isRefreshing) {
      setSize(size + 1)
    }
  },[isFetching, isRefreshing])
  useEffect(()=>{
    if(size>1) setIsFetching(false);
  },[size]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [publishDate, setPublishDate] = useState(null);
  const openCommentModal = workout => () =>{
    if(workout.comment_count>0){
      setShowCommentModal(true);
      setPublishDate(workout.publish_date);
    }
  }
  const closeCommentModal = ()=>{
    setShowCommentModal(false);
  }
  return <>
    <MetaTags>
      <title>Profile Workouts - Fitemos </title>
      <meta
        name="description"
        content="Profile Workouts -Fitemos"
      />
    </MetaTags>
    <TwoColumn>
      <div className="profile-workouts-page">
        <div className="back-profile cursor-pointer" onClick={goBackProfile}>
          <i className="fas fa-chevron-left" /><span>Regresar al Perfil</span>
        </div>
        <div className="workouts">
          {workouts && workouts.map((workout)=>
            <div key={workout.publish_date} className={classnames('item',{'cursor-pointer':workout.comment_count>0})} onClick={openCommentModal(workout)}>
              {workout.spanish_date}
              {workout.completed && <i className="fal fa-check" />}
              {workout.comment_count>0 && <i className="fal fa-comment" />}
            </div>
          )}
          {isFetching && 'Obteniendo más elementos de la lista...'}
        </div>
        {showCommentModal && <WorkoutCommentModal publishDate={publishDate} onClose={closeCommentModal} show={showCommentModal}  customerId={username.id}/>}
      </div>
    </TwoColumn>
  </>
};

export default ProfileWorkouts;
