import React,{useState} from "react";
import { useDispatch, useSelector } from "react-redux";

const FollowButton = (customer)=>{
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const dispatch = useDispatch();  
  const follow = ()=>{

  }
  const unfollow = ()=>{

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
          <button className="btn btn-custom-secondary" onClick={unfollow}>Unfollow</button>
        :
        <button className="btn btn-custom-secondary" onClick={follow}>Follow</button>
    )    
  )
}
export default FollowButton;