import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, Modal } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import CustomerInfo from "./components/CustomerInfo";
import { unfollow, accept, reject, showFollows, appendFollows } from "../redux/notification/actions";
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import { useInfiniteScrollContainer } from "../../../../lib/useInfiniteScroll";

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
          Lista de&nbsp;
          {key === 'followings'?<>
            Partners
          </>:<>
            Seguidores&nbsp;&nbsp;
          </>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey={tabKey} id="list" onSelect={(k) => setKey(k)}>
          <Tab eventKey="followings" title="Partners">
            <div ref={followingsRef}>
              {followings.map((following)=><div className="follow" key={following.id}>
                  <NavLink
                    to={"/"+following.customer.username}
                    className={"link-profile"}
                    onClick={onClose}
                  >
                    <CustomerInfo customer={following.customer} />
                  </NavLink>
                  {following.status === 'pending'&&<>
                    <div>
                      <span>espere</span>
                    </div>
                  </>
                  }                
                  {following.status === 'accepted'&&<>
                    {currentUser.type==="customer" && currentUser.customer.id === customer.id&&
                      <div>
                        <button className="btn btn-custom-secondary unfollow" onClick={handleUnfollow(following.customer_id)} disabled={buttonDisabled}>Remover</button>
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
          <Tab eventKey="followers" title="Seguidores" ref={followersRef}>
            <div ref={followersRef}>
              {followers.map((follower)=><div className="follow" key={follower.id}>
                <NavLink
                  to={"/"+follower.follower.username}
                  className={"link-profile"}
                >
                  <CustomerInfo customer={follower.follower} />
                </NavLink>
                {follower.status === 'pending'&&<div>
                  <button className="btn btn-custom-secondary accept" onClick={handleAccept(follower.id)} disabled={buttonDisabled}>Aceptar</button>
                  <button className="btn btn-custom-secondary reject" onClick={handleReject(follower.id)} disabled={buttonDisabled}>Rechazar</button>
                </div>
                }                
                {follower.status === 'rejected'&&<>
                  <div><span>Rechazado</span></div>
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
