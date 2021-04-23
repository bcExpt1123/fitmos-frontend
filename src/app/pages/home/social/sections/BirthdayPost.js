import React from 'react';
import { useDispatch } from "react-redux";
import BirthdayCustomer from "./customer/BirthdayCustomer";
import { setItemValue } from "../../redux/post/actions";

export default function BirthdayPost({post, suggested}) {
  const dispatch = useDispatch();
  const openCustomerListModal = ()=>{
    dispatch(setItemValue({name:"birthdayPost", value:post}));
  }
  return (
    <div className="social-post birthday">
      <div className="post-header"><h3>Cumpleaños</h3></div>
      <div className="post-body">
        {post.customers.slice(0,4).map(customer=>
          <BirthdayCustomer key={customer.id} customer={customer} post={post}/>
        )}
        <div className="action">
          {post.customers.length>4&&<>
            <button onClick={openCustomerListModal}>Ver Todos</button>
          </>}
        </div>
      </div>
    </div>
  );
}