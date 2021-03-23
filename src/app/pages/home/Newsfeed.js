import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import SVG from "react-inlinesvg";
import Sticky from "wil-react-sticky";
import ThreeColumn from "./layouts/Three";
import { findNewsfeed, appendNewsfeedAfter, appendSuggestedPosts, convertOldNewsfeed, appendOldNewsfeed, setItemValue } from "./redux/post/actions";
import Posts from "./social/sections/Posts";
import SharingPostPopup from "./social/sections/SharingPostPopup";
import LikersModal from "./social/sections/LikersModal";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";

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
  useEffect(()=>{
    if(old){
      window.scrollTo(0, 0);
    }
  },[old])
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
  },[oldPosts]);
  const convertOld = ()=>{
    dispatch(convertOldNewsfeed());
  }
  const [suggestedSticky, setSuggestedSticky] = useState(false);
  const handleChangeSuggeted = (isSticky)=>{
    setSuggestedSticky(isSticky);
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
        {old == 0?
          <>
            {<Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={true} newsfeed={true} topMonitor={"newsfeed"}/>}
            {( suggestedPosts.length>0 || oldPosts.length>0) && last && <>
              <div className="newsfeed mt-2 mb-4 tag-post">
                <div className="cursor-pointer align-center mt-1">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/General/Checked.svg")} />
                </div>
                <div className="font-size-14 font-weight-bold align-center mt-1">You’re All Caught Up</div>
                <div className="font-size-14 align-center mt-1">You’ve seen all new posts from the past 3 days.</div>
                {oldPosts.length>0&&<div className="font-size-14 font-weight-bold align-center cursor-pointer" style={{color:"#008EB2"}} onClick={convertOld}>View Older Posts</div>}
              </div>
              <div className="newsfeed suggested-header">
                <Sticky offsetTop={62} onChange={handleChangeSuggeted}>
                  {suggestedPosts.length>0 && <div className="font-size-14 font-weight-bold pt-4 pl-3 pb-3">Suggested Posts </div>}
                  {(suggestedSticky&&oldPosts.length>0) &&<div className="font-size-14 font-weight-bold cursor-pointer old-posts-button" onClick={convertOld}>
                      Older Posts
                    </div>
                  }
                </Sticky>
              </div>
              {<Posts posts={suggestedPosts} last={suggestedPostsLast} dispatchAction={dispatchSuggestedAction}  show={false} newsfeed={true} topMonitor={"suggestedPosts"}/>}
            </>}
          </>
        :
          <>
            <div className="newsfeed mt-2 mb-4">
              <h3><a onClick={backNewsfeed}><i className="fas fa-arrow-left" /></a> <span className="font-weight-bold">Older Posts</span></h3>
            </div>
            {<Posts posts={oldPosts} last={oldLast} dispatchAction={dispatchOldAction}  show={false} newsfeed={true} suggested={true} topMonitor={"oldNewsfeed"}/>}
          </>
        }
        <SharingPostPopup />
        <LikersModal />
      </ThreeColumn>
    </>
  );
}