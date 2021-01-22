import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import OneColumn from "../../layouts/One";
import { findPost } from "../../redux/post/actions";
import Post from "../sections/Post";
const PostPage = ({match}) => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findPost(match.params.id));
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
      <div className="post-page">
        {post&&
          <Post post={post}/>
        }
      </div>
    </OneColumn>
  </>
};

export default PostPage;
