import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import { $changeItem } from "../../../modules/subscription/event";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import SectionPost from "./SectionPost";
import Private from "./components/Private";

import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
const PostPage = ({match}) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch($changeItem(match.params.id));    
  }, []);
  const post = useSelector(({ event }) => event.item);
  return (
    post&&(
      <>
        <MetaTags>
          <title>{post.title} -Fitemos </title>
          <meta
            name="description"
            content={post.excerpt}
          />
        </MetaTags>
    
        <NavBar />
    
        <Private section={()=><SectionPost id={match.params.id}/>} />
    
        <Footer />
      </>
    )
  );
};

export default PostPage;
