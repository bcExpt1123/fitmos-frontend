import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import TwoColumn from "../../layouts/Two";
import { matchPath, useHistory } from "react-router-dom";
import { appendCustomerPostMediasAfter} from "../../redux/post/actions";
import {findUsername, setItemValue} from "../../redux/people/actions";
import ClickableMedia from "../sections/ClickableMedia";
import PostModal from "../sections/PostModal";
import { useInfiniteScroll } from "../../../../../lib/useInfiniteScroll";

const PicturesPage = () => {
  const match = matchPath(window.location.pathname, {
    path:['/:username/pictures'],
    exact:true,
    strict:true
  });  
  const username = useSelector(({people})=>people.username);
  const dispatch = useDispatch();
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const selfMedias = useSelector(({post})=>post.selfMedias);
  const last = useSelector(({post})=>post.selfMediasLast);
  useEffect(()=>{
    if(match&&match.params){
      dispatch(findUsername(match.params.username));
    }
    return ()=>{
      // dispatch(setItemValue({name:'username',value:'username'}));
    }      
  },[])
  useEffect(()=>{
    if(username.type=='customer')dispatch(appendCustomerPostMediasAfter(username.id));
  },[username]);
  const [show, setShow] = useState(false);
  const [media, setMedia] = useState(false);
  const onClose = ()=>{
    setShow(false);
    setTimeout(() => {
      console.log(show)
    }, 100);
  }
  const history = useHistory();
  const goBackProfile=()=>{
    const path = window.location.pathname.substring(0, Math.max(window.location.pathname.lastIndexOf("/"), window.location.pathname.lastIndexOf("\\"))); 
    history.push(path);
  }
  const fetchMoreListItems = ()=>{
    if(!last){
      dispatch(appendCustomerPostMediasAfter(match.params.id));
    }
    else setIsFetching(false);
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  return <>
    <MetaTags>
      <title>Profile Medias -Fitemos </title>
      <meta
        name="description"
        content="Profile Medias -Fitemos"
      />
    </MetaTags>
    <TwoColumn>
      <div className="post-medias-page">
        <div className="back-profile cursor-pointer" onClick={goBackProfile}>
          <i className="fas fa-chevron-left" /><span>Regresar al Perfil</span>
        </div>
        {selfMedias.length===0?<>There is no items</>
          :
          <div className="medias">
            {selfMedias.map((media)=>
              <ClickableMedia file={media} key={media.id} setShow={setShow} setMedia={setMedia}/>
            )}
            {isFetching && 'Obteniendo más elementos de la lista...'}
          </div>
        }
      </div>
    </TwoColumn>
    <PostModal show={show} onClose={onClose} media={media}/>    
  </>
};

export default PicturesPage;
