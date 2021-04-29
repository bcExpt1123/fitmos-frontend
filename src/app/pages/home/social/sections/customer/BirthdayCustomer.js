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
      <NavLink
        to={"/"+customer.username}
        className={"info"}
      >
        <div className="">
          <div className="fullname">{customer.first_name} {customer.last_name}</div>
          {post.type==='join'?<div className="birthday">@{customer.username}</div>
            :<div className="birthday">{post.label}</div>}
        </div>
      </NavLink>
      {(customer.chat_id && currentUser.customer.blockedChatIds.includes(customer.chat_id)===false) ?<i className="fal fa-comments"  onClick={handleClick} />:<i className=" fa-comments"/>}
    </div>
  );
}