import React,{useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../../redux/notification/actions";

const FollowButton = ({customer})=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const buttonDisabled = useSelector(({ notification }) => notification.followDisabled);
  const dispatch = useDispatch();  
  const handleFollow = ()=>{
    dispatch(follow(customer.id));
  }
  const handleUnfollow = ()=>{
    dispatch(unfollow(customer.id));
  }
  return (
    (customer&&customer.id != currentUser.customer.id)&&(
      customer.following?
        customer.following.status === 'rejeced'?
          <button className="btn btn-custom-secondary">Rejected</button>
          :
          customer.following.status === 'pending'?
          <button className="btn btn-custom-secondary">Following</button>
          :
          <button className="btn btn-custom-secondary" onClick={handleUnfollow} disabled={buttonDisabled}>Unfollow</button>
        :
        <button className="btn btn-custom-third" onClick={handleFollow} disabled={buttonDisabled}>Follow</button>
    )    
  )
}
export default FollowButton;