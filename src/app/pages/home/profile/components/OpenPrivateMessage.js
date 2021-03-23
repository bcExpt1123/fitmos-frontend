import React from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { openPrivateDialog } from "../../redux/dialogs/actions";

const OpenPrivateMessage = ({customer}) => {  
  const dispatch = useDispatch();
  const handleClick = ()=>{
    if(customer.user.chat_id)dispatch(openPrivateDialog(customer));
  }
  const currentUser = useSelector(({auth})=>auth.currentUser);
  return (
    <button className="btn btn-custom-secondary" onClick={handleClick} disabled={currentUser.customer.blockedChatIds.length>0 && currentUser.customer.blockedChatIds.includes(customer.user.chat_id)}>
      Message
    </button>
  )
}  
export default OpenPrivateMessage;