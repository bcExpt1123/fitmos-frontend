import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { Tab, Tabs, Modal } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import Avatar from "../components/Avatar";
import { follow, unfollow, showFollows } from "../redux/notification/actions";

const FollowingListModal = ({show, onClose,tabKey, customer}) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState(tabKey);
  const followings =  useSelector(({ notification }) => notification.followings);
  const followers =  useSelector(({ notification }) => notification.followers);
  const buttonDisabled = useSelector(({ notification }) => notification.followDisabled);
  useEffect(()=>{
    dispatch(showFollows({key, customer}));
  },[key]);// eslint-disable-line react-hooks/exhaustive-deps
  const handleFollow = (customerId)=>()=>{
    dispatch(follow(customerId));
  }
  const handleUnfollow = (customerId)=>()=>{
    dispatch(unfollow(customerId));
  }
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
            {followings.map((following)=><div>
              <NavLink
                to={"/"+following.customer.username}
                className={"link-profile"}
              >
                <Avatar pictureUrls={following.customer.avatarUrls} size="xs" />
                <div className="full-name">{following.customer.first_name} {following.customer.last_name}</div>
                <div className="username">@{following.customer.username}</div>
              </NavLink>
                {following.status === 'pending'&&<>
                  Waiting
                </>
                }                
                {following.status === 'accepted'&&<span>
                  <button className="btn btn-custom-secondary" onClick={handleUnfollow(following.customer_id)} disabled={buttonDisabled}>Unfollow</button>
                </span>
                }
              </div>
            )}
          </Tab>
          <Tab eventKey="followers" title="Followers">
            {followers.map((follower)=><div>
                <div>
                  username and avatar
                </div>
                accept
                reject
              </div>
            )}
          </Tab>
        </Tabs>                        
      </Modal.Body>
    </Modal>
  );
}

export default FollowingListModal;
