import React,{useState,useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { matchPath, NavLink } from "react-router-dom";
import { findRandomMedias} from "../../redux/post/actions";
import ClickableMedia from "./ClickableMedia";
import PostModal from "./PostModal";

const RightBar = () => {  
  const match = matchPath(window.location.pathname, {
    path:['/customers/:id','/profile'],
    exact:true,
    strict:true
  });  
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const dispatch = useDispatch();
  const selfMedias = useSelector(({post})=>post.selfRandomMedias);
  const otherMedias = useSelector(({post})=>post.otherRandomMedias);
  useEffect(()=>{
    if(match&&match.params){
      if(match.path === '/profile' ){
        dispatch(findRandomMedias(currentUser.customer.id));
      }else{
        dispatch(findRandomMedias(match.params.id));
      }
    }
  },[])
  const [show, setShow] = useState(false);
  const [media, setMedia] = useState(false);
  const onClose = ()=>{
    setShow(false);
    setTimeout(() => {
      console.log(show)
    }, 100);
  }
  return (  
    <div id="rightbar">
      {match?
        <>
          <div className="wrapper-rightbar">
            <div className="label">Galería de María <NavLink  className="" to={match.path === '/profile'?"/profile/pictures":`/customers/${match.params.id}/pictures`}>Ver Todos</NavLink></div>
            <div className="body">
              {selfMedias.length===0?<>There is no items</>
                :
                <div className="medias">
                  {selfMedias.map((media)=>
                    <ClickableMedia file={media} key={media.id} setShow={setShow} setMedia={setMedia}/>
                  )}
                </div>
              }
            </div>
          </div>
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
        <>
          <div className="wrapper-rightbar">
            Eventos
          </div>
          <div className="wrapper-rightbar">
            Noticias
          </div>
          <div className="wrapper-rightbar">
            Shop
          </div>
        </>        
      }
      <PostModal show={show} onClose={onClose} media={media}/>
    </div>
    )  
}  
export default RightBar;