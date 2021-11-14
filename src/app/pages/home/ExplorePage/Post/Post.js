import React,{useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import { matchPath } from "react-router-dom";

import { $changeItem } from "../../../../../modules/subscription/event";
import SectionPost from "../../sections/SectionPost";
import Private from "../../components/Private";
import SplashScreen from "../../../../../app/partials/layout/SplashScreen";

const PostPage = () => {
  const dispatch = useDispatch();
  const match = matchPath(window.location.pathname, {
    path:'/news/:id',
    exact:true,
    strict:true
  });    
  useEffect(() => {
    dispatch($changeItem(match.params.id));
    window.scrollTo(0, 0);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const post = useSelector(({ event }) => event.item);
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  return (
    post?(
      <>
        <MetaTags>
          <title>{post.title} -Fitemos </title>
          <meta
            name="description"
            content={post.excerpt}
          />
        </MetaTags>
        <Private section={()=><SectionPost id={match.params.id}/>} />
      </>
    ):(
      <div className="loading" style={{marginTop:"300px"}}>
        <SplashScreen />
      </div>
    )
  );
};

export default PostPage;
