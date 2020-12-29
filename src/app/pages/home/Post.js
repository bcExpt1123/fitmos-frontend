import React,{useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";

import { $changeItem } from "../../../modules/subscription/event";
import OneColumn from "./layouts/One";
import ThreeColumn from "./layouts/Three";
import PageHeader from "./layouts/PageHeader";
import SectionPost from "./sections/SectionPost";
import Private from "./components/Private";
import SplashScreen from "../../../app/partials/layout/SplashScreen";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
const PostPage = ({match}) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch($changeItem(match.params.id));    
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

        {currentUser?(
          <ThreeColumn>
            <PageHeader title={`Blog`}/>
            <Private section={()=><SectionPost id={match.params.id}/>} />
          </ThreeColumn>
        ):(
          <OneColumn>
            <Private section={()=><SectionPost id={match.params.id}/>} />
          </OneColumn>
        )}
      </>
    ):(
      <div className="loading" style={{marginTop:"300px"}}>
        <SplashScreen />
      </div>
    )
  );
};

export default PostPage;
