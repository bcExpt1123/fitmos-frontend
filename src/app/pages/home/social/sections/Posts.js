import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Post from "./Post";
import useInfiniteScroll from "../../../../../lib/useInfiniteScroll";
import CreatePostModal from "../posts/CreatingModal";

export default function Posts({posts,last,dispatchAction, show}) {
  const currentUser = useSelector(({auth})=>auth.currentUser);
  useEffect(() => {
    setIsFetching(false);
  }, [posts]);// eslint-disable-line react-hooks/exhaustive-deps
  const [showCreatingPost, setShowCreatingPost] = useState(false);
  const OpenCreatingPost = ()=>{
    setShowCreatingPost(true);
  }  
  const handleCreatingModalClose = () => {
    setShowCreatingPost(false);
  }
  const fetchMoreListItems = ()=>{
    if(!last)dispatchAction();
    else setIsFetching(false);
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  return (
    <>
      {show&&
        <div className="tag-post">
          What's on your mind? {currentUser.customer.first_name}
          <button type="button" className={"clickable-button"} onClick={OpenCreatingPost}>
            <i className="far fa-plus-square" />
          </button>
        </div>
      }
      <div>
        {posts.length == 0?<div className="tag-post">There is no items</div>:
          <>{
            posts.map(post=>
              <Post post={post} key={post.id}/>
            )}
            {isFetching && 'Obteniendo más elementos de la lista...'}
          </>
        }
      </div>
      <CreatePostModal show={showCreatingPost} handleClose={handleCreatingModalClose}/>
    </>
  );
}