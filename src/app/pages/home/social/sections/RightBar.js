import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { matchPath, NavLink } from "react-router-dom";
import Sticky from "wil-react-sticky";
import { findRandomMedias} from "../../redux/post/actions";
import ClickableMedia from "./ClickableMedia";
import Other from "./RightBarOther";
import PostModal from "./PostModal";

const RightBar = () => {  
  const username = useSelector(({people})=>people.username);
  const dispatch = useDispatch();
  const selfMedias = useSelector(({post})=>post.selfRandomMedias);
  const otherMedias = useSelector(({post})=>post.otherRandomMedias);
  const openEditModal = useSelector(({post})=>post.openEditModal);
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
    setTimeout(() => {
      console.log(show)
    }, 100);
  }
  return (  
    <div className="rightbar">
      <Sticky offsetTop={130}>
        {username.type === 'customer'?
          <>
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
          </>:
          <Other />
        }
      </Sticky>
      <PostModal show={show} onClose={onClose} media={media}/>
    </div>
    )  
}  
export default RightBar;