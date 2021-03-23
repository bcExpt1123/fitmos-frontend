import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import throttle from 'lodash/throttle';
import Avatar from "../../components/Avatar";
import { http } from "../../services/api";
import { setItemValue } from "../../redux/post/actions";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { useInfiniteScrollContainer } from "../../../../../lib/useInfiniteScroll";

const LikersModal = () => {
  const dispatch = useDispatch();
  const likersOpenSetting = useSelector(({post})=>post.likersOpenSetting);
  const [likers, setLikers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [last, setLast] = useState(false);
  async function fetchData(){
    if(!last){
      let path="likes?activity_id="+likersOpenSetting.activityId+"&pageNumber="+pageNumber;
      const res = await http({
        path
      });
      if(res.data && pageNumber < res.data.current_page){
        setPageNumber(res.data.current_page);
        if(res.data.current_page == res.data.last_page)setLast(true);
        const likes = likers.concat(res.data.data);
        setLikers(likes);
      }
    }
  }
  useEffect(()=>{
    if(likersOpenSetting.activityId!=null)fetchData();
    else setLikers([]);
  },[likersOpenSetting]);
  const onClose = ()=>{
    dispatch(setItemValue({name:"likersOpenSetting", value:{show:false,activityId:null}}));
    setLast(false);
    setPageNumber(0);
    setLikers([]);
  }
  const likersRef = useRef();
  const fetchMoreLikersListItems = ()=>{
    if(!last){
      fetchData();
    }
    else setIsLikersFetching(false);
  }
  const [isLikersFetching, setIsLikersFetching] = useInfiniteScrollContainer(fetchMoreLikersListItems,likersRef);
  return (
    <Modal
      dialogClassName="likers-modal"
      show={likersOpenSetting.show}
      onHide={onClose}
      animation={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          People
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <div ref={likersRef} className="likers">{
            likers.map(like=><NavLink to={"/" + like.customer.username} key={like.id} className="tag-follower" onClick={onClose}>
              <div className="avatar">
                <Avatar
                  pictureUrls={like.customer.avatarUrls}
                  size="xs"
                  className={"userAvatar"}
                />
              </div>
              <div className="info">
                <div>{like.customer.first_name} {like.customer.last_name}</div>
                <div className="username">{like.customer.username}</div>
              </div>
            </NavLink>)
          }
          </div>
        }
        <div className="dialog-loader vh-centered">
          {
            isLikersFetching&&
              <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
          }
        </div>          
      </Modal.Body>
    </Modal>
  );
}

export default LikersModal;