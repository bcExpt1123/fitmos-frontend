import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import { openPrivateDialog } from "../../../redux/dialogs/actions";


export default function BirthdayCustomer({customer,post}) {
  const dispatch = useDispatch();
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const handleClick = ()=>{
    if(customer.chat_id)dispatch(openPrivateDialog(customer));
  }
  return (
    <div className="birthday-customer">
      <NavLink
        to={"/"+customer.username}
        className={"link-profile"}
      >
        <Avatar pictureUrls={customer.avatarUrls} size="xs" />
      </NavLink>
      <div className="info">
        <div className="fullname">{customer.first_name} {customer.last_name}</div>
        <div className="birthday">{post.label}</div>
      </div>
      {customer.chat_id && currentUser.customer.blockedChatIds.includes(customer.chat_id)===false &&<i className="fal fa-comments"  onClick={handleClick} />}
    </div>
  );
}