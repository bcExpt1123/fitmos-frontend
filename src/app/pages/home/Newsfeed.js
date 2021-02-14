import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import ThreeColumn from "./layouts/Three";
import { findNewsfeed, appendNewsfeedAfter, appendSuggestedPosts, convertOldNewsfeed, appendOldNewsfeed, setItemValue } from "./redux/post/actions";
import Posts from "./social/sections/Posts";

export default function Newsfeed() {
  const posts = useSelector(({post})=>post.newsfeed);
  const suggestedPosts = useSelector(({post})=>post.suggestedPosts);
  const oldPosts = useSelector(({post})=>post.oldNewsfeed);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.newsfeedLast);
  const oldLast = useSelector(({post})=>post.oldNewsfeedLast);
  const suggestedPostsLast = useSelector(({post})=>post.suggestedPostsLast);
  const old = useSelector(({post})=>post.old);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findNewsfeed());
  },[])
  const dispatchAction = ()=>{
    dispatch(appendNewsfeedAfter());
  }
  const dispatchSuggestedAction= ()=>{
    dispatch(appendSuggestedPosts());
  }
  const dispatchOldAction = ()=>{
    dispatch(appendOldNewsfeed());
  }
  const backNewsfeed = ()=>{
    dispatch( setItemValue({name:"old",value:0}) );
  }
  useEffect(()=>{
    if(posts.length == 0 )setTimeout(()=>dispatch(appendSuggestedPosts()),4000);
    console.log(oldPosts.length)
  },[oldPosts]);
  const convertOld = ()=>{
    dispatch(convertOldNewsfeed());
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
        {old ==0?
          <>
            {<Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={true} newsfeed={true}/>}
            {suggestedPosts.length>0&&<>
              <div className="newsfeed mt-2 mb-4">
                <span className="font-weight-bold">Suggested Posts</span> 
                {oldPosts.length>0&&<button className="btn btn-custom-third" style={{float:"right",marginTop:"-15px"}} onClick={convertOld}>View Older Posts</button>}
              </div>
              {<Posts posts={suggestedPosts} last={suggestedPostsLast} dispatchAction={dispatchSuggestedAction}  show={false} newsfeed={true}/>}
            </>}
          </>
        :
          <>
            <div className="newsfeed mt-2 mb-4">
              <h3><a onClick={backNewsfeed}><i className="fas fa-arrow-left" /></a> <span className="font-weight-bold">Older Posts</span></h3>
            </div>
            {<Posts posts={oldPosts} last={oldLast} dispatchAction={dispatchOldAction}  show={false} newsfeed={true}/>}
          </>
        }
      </ThreeColumn>
    </>
  );
}