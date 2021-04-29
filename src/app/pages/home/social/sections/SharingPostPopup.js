import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SharePopup from "../../components/Share/Popup";
import { sharePost } from "../../redux/messages/actions";

const SharingPostPopup = ()=>{
  const dispatch = useDispatch();
  const postId = useSelector(({post})=>post.selectedPostId);
  const selectCustomer = (customer)=>{
    dispatch(sharePost({customer,postId}));
  }
  return <SharePopup selectCustomerCallback={selectCustomer}/>
}
export default SharingPostPopup;