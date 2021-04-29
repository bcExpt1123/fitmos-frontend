import React from 'react';
import { convertTime } from "../../../../../lib/common";
import BirthdayCustomer from "./customer/BirthdayCustomer";

export default function JoinPost({post}) {
  return (
    <div className="social-post join">
      <div className="post-header">
        <h3>¡Saluda a tu nueva compañera!</h3>
        <div className="post-time" >{convertTime(post.created_at)}</div>
      </div>
      <div className="post-body">
        <BirthdayCustomer customer={post.customer} post={post}/>
      </div>
    </div>
  );
}