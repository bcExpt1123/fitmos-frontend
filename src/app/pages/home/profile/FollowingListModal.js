import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Tab, Tabs, Modal } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Avatar from "../components/Avatar";
import { unfollow, accept, reject, showFollows, appendFollows } from "../redux/notification/actions";
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";

const useInfiniteScrollContainer = (callback,target) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if(target.current)target.current.addEventListener('scroll', handleScroll);
    return () => {if(target.current)target.current.removeEventListener('scroll', handleScroll)};
  },[target,target.current]);

  useEffect(() => {
    if (!isFetching) return;
    callback(() => {
      console.log('called back');
    });
  }, [isFetching,callback]);

  function handleScroll() {
    if (target.current.offsetHeight + target.current.scrollTop !== target.current.scrollHeight 
      || isFetching) return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};


const NoRecords = ()=>
  <div style={{display:'flex',alignItems: 'center',justifyContent: 'center',height:"200px"}}>
    <div style={{maxWidth: '50%',fontSize:'15px',fontWeight:'600'}}>No Records</div>
  </div>
const FollowingListModal = ({show, onClose,tabKey, customer}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const [key, setKey] = useState(tabKey);
  const followings =  useSelector(({ notification }) => notification.followings);
  const followingsLast =  useSelector(({ notification }) => notification.followingsLast);
  const followers =  useSelector(({ notification }) => notification.followers);
  const followersLast =  useSelector(({ notification }) => notification.followersLast);
  const buttonDisabled = useSelector(({ notification }) => notification.followDisabled);
  useEffect(()=>{
    dispatch(showFollows({key, customer}));
  },[key]);// eslint-disable-line react-hooks/exhaustive-deps
  const handleUnfollow = (customerId)=>()=>{
    dispatch(unfollow(customerId));
  }
  const handleAccept = (id)=>()=>{
    dispatch(accept(id));
  }
  const handleReject = (id)=>()=>{
    dispatch(reject(id));
  }
  const followingsRef = useRef();
  const followersRef = useRef();
  const fetchMoreFollowingsListItems = ()=>{
    if(!followingsLast)dispatch(appendFollows('followings'));
    else setIsFollowingsFetching(false);
  }
  const [isFollowingsFetching, setIsFollowingsFetching] = useInfiniteScrollContainer(fetchMoreFollowingsListItems,followingsRef);
  const fetchMoreFollowersListItems = ()=>{
    if(!followersLast)dispatch(appendFollows('followers'));
    else setIsFollowersFetching(false);
  }
  const [isFollowersFetching, setIsFollowersFetching] = useInfiniteScrollContainer(fetchMoreFollowersListItems,followersRef);
  return (
    <Modal
      show={show}
      onHide={onClose}
      animation={false}
      className="following-list"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">
          {key === 'followings'?<>
            Followings
          </>:<>
          Followers&nbsp;&nbsp;
          </>}
          &nbsp;  List
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey={tabKey} id="list" onSelect={(k) => setKey(k)}>
          <Tab eventKey="followings" title="Followings">
            <div ref={followingsRef}>
              {followings.map((following)=><div className="follow" key={following.id}>
                  <NavLink
                    to={"/"+following.customer.username}
                    className={"link-profile"}
                  >
                    <div className="avatar">
                      <Avatar pictureUrls={following.customer.avatarUrls} size="xs" />
                    </div>
                    <div className="info">
                      <div className="full-name">{following.customer.first_name} {following.customer.last_name}</div>
                      <div className="username">{following.customer.username}</div>
                    </div>
                  </NavLink>
                  {following.status === 'pending'&&<>
                    <div>
                      <span>Waiting</span>
                    </div>
                  </>
                  }                
                  {following.status === 'accepted'&&<>
                    {currentUser.customer.id === customer.id&&
                      <div>
                        <button className="btn btn-custom-secondary unfollow" onClick={handleUnfollow(following.customer_id)} disabled={buttonDisabled}>Unfollow</button>
                      </div>
                    }
                  </>
                  }
                </div>
              )}
              {followings.length===0&&<NoRecords />}
              {isFollowingsFetching && <div className="loading-container">
                <img src={toAbsoluteUrl("/media/loading/loading.gif")} alt="loading..." />
              </div>}
            </div>
          </Tab>
          <Tab eventKey="followers" title="Followers" ref={followersRef}>
            <div ref={followersRef}>
              {followers.map((follower)=><div className="follow" key={follower.id}>
                <NavLink
                  to={"/"+follower.follower.username}
                  className={"link-profile"}
                >
                  <div className="avatar">
                    <Avatar pictureUrls={follower.follower.avatarUrls} size="xs" />
                  </div>
                  <div className="info">
                    <div className="full-name">{follower.follower.first_name} {follower.follower.last_name}</div>
                    <div className="username">{follower.follower.username}</div>
                  </div>
                </NavLink>
                {follower.status === 'pending'&&<div>
                  <button className="btn btn-custom-secondary accept" onClick={handleAccept(follower.id)} disabled={buttonDisabled}>Accept</button>
                  <button className="btn btn-custom-secondary reject" onClick={handleReject(follower.id)} disabled={buttonDisabled}>Reject</button>
                </div>
                }                
                {follower.status === 'rejected'&&<>
                  <div><span>Rejected</span></div>
                </>
                }
              </div>
              )}
              {followers.length===0&&<NoRecords />}
              {isFollowersFetching && <div className="loading-container">
                <img src={toAbsoluteUrl("/media/loading/loading.gif")} alt="loading..." />
              </div>}
            </div>
          </Tab>
        </Tabs>                        
      </Modal.Body>
    </Modal>
  );
}

export default FollowingListModal;
