import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import OneColumn from "../../layouts/One";
import { findPost } from "../../redux/post/actions";
import Post from "../sections/Post";
import SharingPostPopup from "../sections/SharingPostPopup";
import LikersModal from "../sections/LikersModal";

const PostPage = ({match}) => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findPost({id:match.params.id,comment:0}));
  },[match.params.id]);
  const post = useSelector(({post})=>post.post);
  return <>
    <MetaTags>
      <title>search -Fitemos </title>
      <meta
        name="description"
        content="Post -Fitemos"
      />
    </MetaTags>
    <OneColumn>
      <div className="post-page newsfeed">
        {post&&
          <>
            <Post post={post}/>
            <SharingPostPopup />
            <LikersModal />
          </>
        }
      </div>
    </OneColumn>
  </>
};

export default PostPage;
