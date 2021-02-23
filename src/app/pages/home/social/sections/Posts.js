import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Post from "./Post";
import useInfiniteScroll from "../../../../../lib/useInfiniteScroll";
import CreatePostModal from "../posts/CreatingModal";
import PostModal from "../sections/PostModal";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

export default function Posts({posts,last,dispatchAction, show, newsfeed, suggested}) {
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
    console.log(last, isFetching)
    if(!last)dispatchAction();
    else setIsFetching(false);
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, last);
  /** post modal */
  const [showPostModal, setShowPostModal] = useState(false);
  const [media, setMedia] = useState(false);
  const onClose = ()=>{
    setShowPostModal(false);
    setTimeout(() => {
      console.log(show)
    }, 100);
  }
  return (
    <div className="newsfeed">
      {show&&
        <div className="tag-post cursor-pointer" onClick={OpenCreatingPost}>
          What's on your mind? {currentUser.customer.first_name}
          <button type="button" className={"clickable-button"}>
            <i className="fal fa-plus-square" />
          </button>
        </div>
      }
      <div>
        {posts.length > 0&&
          <>{
            posts.map(post=>
              <Post post={post} newsfeed={newsfeed} key={post.id} suggested={suggested} setMedia={setMedia} setShowPostModal={setShowPostModal}/>
            )}
            {isFetching && <div className="loading-container">
              <img src={toAbsoluteUrl("/media/loading/loading.gif")} alt="loading..." />
            </div>}
          </>
        }
      </div>
      <CreatePostModal show={showCreatingPost} handleClose={handleCreatingModalClose}/>
      <PostModal show={showPostModal} onClose={onClose} media={media}/>
    </div>
  );
}