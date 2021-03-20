import React from 'react';  
import { useDispatch } from "react-redux";
import { openPrivateDialog } from "../../redux/dialogs/actions";

const OpenPrivateMessage = ({customer}) => {  
  const dispatch = useDispatch();
  const handleClick = ()=>{
    if(customer.user.chat_id)dispatch(openPrivateDialog(customer));
  }
  return (
    <button className="btn btn-custom-secondary" onClick={handleClick}>
      Message
    </button>
  )
}  
export default OpenPrivateMessage;