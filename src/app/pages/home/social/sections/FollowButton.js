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
          <button className="btn btn-custom-secondary follow">Rejected</button>
          :
          customer.following.status === 'pending'?
          <button className="btn btn-custom-secondary follow">Requested</button>
          :
          <button className="btn btn-custom-secondary follow" onClick={handleUnfollow} disabled={buttonDisabled}>Remover</button>
        :
        <button className="btn btn-custom-third follow" onClick={handleFollow} disabled={buttonDisabled}>Agregar</button>
    )    
  )
}
export default FollowButton;