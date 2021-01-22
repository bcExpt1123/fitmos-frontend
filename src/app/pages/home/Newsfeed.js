import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import ThreeColumn from "./layouts/Three";
import { findNewsfeed, appendNewsfeedAfter } from "./redux/post/actions";
import Posts from "./social/sections/Posts";

export default function Newsfeed() {
  const posts = useSelector(({post})=>post.newsfeed);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.newsfeedLast);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findNewsfeed());
  },[])
  const dispatchAction = ()=>{
    dispatch(appendNewsfeedAfter());
  }
  return (
    <>
      <MetaTags>
      <title>Newsfeed - Fitemos </title>
      <meta
        name="description"
        content="Newsfeed - Fitemos"
      />
      </MetaTags>
      <ThreeColumn>
        {<Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={true}/>}
      </ThreeColumn>
    </>
  );
}