import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "./Post";
import { useInfiniteScroll } from "../../../../../lib/useInfiniteScroll";
import CreatePostModal from "../posts/CreatingModal";
import PostModal from "../sections/PostModal";
import ViewableMonitor from '../../components/ViewableMonitor';
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { setItemValue } from "../../redux/post/actions";

export default function Posts({posts,last,dispatchAction, show, newsfeed, suggested, topMonitor}) {
  const currentUser = useSelector(({auth})=>auth.currentUser);
  useEffect(() => {
    setIsFetching(false);
  }, [posts]);// eslint-disable-line react-hooks/exhaustive-deps
  const [showCreatingPost, setShowCreatingPost] = useState(false);
  const OpenCreatingPost = ()=>{
    console.log("clicked")
    setShowCreatingPost(true);
  }  
  const handleCreatingModalClose = () => {
    setShowCreatingPost(false);
  }
  const fetchMoreListItems = ()=>{
    if(!last)dispatchAction();
    else setIsFetching(false);
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, last);
  /** post modal */
  const [showPostModal, setShowPostModal] = useState(false);
  const [media, setMedia] = useState(false);
  const dispatch = useDispatch();
  const onClose = ()=>{
    setShowPostModal(false);
    setMedia(false);
    dispatch(setItemValue({name:"videoPlayerOpenModal",value:false}));
    dispatch(setItemValue({name:"videoPlayerModalMode",value:false}));
    setTimeout(() => {
      console.log(show)
    }, 100);
  }
  /** visibleMonistor */
  const visibleChange = (status)=>{
    console.log(topMonitor, status)
    if(topMonitor)dispatch(setItemValue({name:topMonitor+"TopVisible",value:status}));
  }
  return (
    <div className="newsfeed">
      {topMonitor && <ViewableMonitor visibleChange = {visibleChange}>
          {isViewable =>
            <div></div>
          }
        </ViewableMonitor>
      }
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
      {currentUser.type==="customer" && <CreatePostModal show={showCreatingPost} handleClose={handleCreatingModalClose}/>}
      {showPostModal && <PostModal show={showPostModal} onClose={onClose} media={media}/>}
    </div>
  );
}