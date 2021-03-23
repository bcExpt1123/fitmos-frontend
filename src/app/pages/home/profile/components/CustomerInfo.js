import React from "react";
import Avatar from "../../components/Avatar";

const CustomerInfo = ({customer})=>{
  return (
    <>
      <div className="avatar">
        <Avatar pictureUrls={customer.avatarUrls} size="xs" />
      </div>
      <div className="info">
        <div className="full-name">{customer.first_name} {customer.last_name}</div>
        <div className="username">{customer.username}</div>
      </div>
    </>
  )
}
export default CustomerInfo;