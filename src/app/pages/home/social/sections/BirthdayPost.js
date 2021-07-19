import React from 'react';
import { useDispatch } from "react-redux";
import BirthdayCustomer from "./customer/BirthdayCustomer";
import ViewableMonitor from '../../components/ViewableMonitor';
import { setItemValue, readingPost } from "../../redux/post/actions";

export default function BirthdayPost({post}) {
  const dispatch = useDispatch();
  const openCustomerListModal = ()=>{
    dispatch(setItemValue({name:"birthdayPost", value:post}));
  }
  const visibleChange = (status)=>{
    if(status){
      dispatch(readingPost(post));
    }
  }
  return (
    <ViewableMonitor visibleChange = {visibleChange} threshold={0.3}>
      {() =>
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
      }
    </ViewableMonitor>    
  );
}