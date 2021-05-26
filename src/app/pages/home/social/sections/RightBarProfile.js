import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import { findRandomMedias} from "../../redux/post/actions";
import ClickableMedia from "./ClickableMedia";
import PostModal from "./PostModal";
import { httpApi } from "../../services/api";

const RightBarProfile = () => {  
  const username = useSelector(({people})=>people.username);
  const dispatch = useDispatch();
  const selfMedias = useSelector(({post})=>post.selfRandomMedias);
  const otherMedias = useSelector(({post})=>post.otherRandomMedias);
  const openEditModal = useSelector(({post})=>post.openEditModal);
  const { data, error } = useSWR(username.type === 'customer'?'workout-comments/publish?customer_id=' + username.id + '&page_size=4':null, httpApi)
  const workouts = data?.data;
  useEffect(()=>{
    if(username.type === 'customer'){
        dispatch(findRandomMedias(username.id));
    }
  },[username])
  useEffect(()=>{
    if(openEditModal)setShow(false);
    else if(media){
      setShow(true);
    }
  },[openEditModal]);
  const [show, setShow] = useState(false);
  const [media, setMedia] = useState(false);
  const onClose = ()=>{
    setShow(false);
    setMedia(false);
  }
  return (  
      <>
        {username.type === 'customer' && username.is_manager === false && (
          <div className="wrapper-rightbar">
            <div className="label">Bitácora <NavLink  className="" to={`/${username.username}/workouts`}>Ver Todos</NavLink></div>
            <div className="body">
              <div className="workouts">
                {workouts && workouts.map((workout)=>
                  <div key={workout.publish_date} className='item'>
                    {workout.spanish_date}
                    {workout.completed && <i className="fal fa-check" />}
                    {workout.comment_count>0 && <i className="fal fa-comment" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {selfMedias.length>0&&
          <div className="wrapper-rightbar">
            <div className="label">Galería de {username.first_name} <NavLink  className="" to={`/${username.username}/pictures`}>Ver Todos</NavLink></div>
            <div className="body">
              <div className="medias">
                {selfMedias.map((media)=>
                  <ClickableMedia file={media} key={media.id} setShow={setShow} setMedia={setMedia}/>
                )}
              </div>
            </div>
          </div>
        }
        <div className="wrapper-rightbar">
          <div className="label">Galería de la Comunidad</div>
          <div className="body">
            {otherMedias.length===0?<>There is no items</>
              :
              <div className="medias">
                {otherMedias.map((media)=>
                  <ClickableMedia file={media} key={media.id} setShow={setShow} setMedia={setMedia}/>
                )}
              </div>
            }
          </div>
        </div>
        <PostModal show={show} onClose={onClose} media={media}/>
      </>
    )  
}  
export default RightBarProfile;