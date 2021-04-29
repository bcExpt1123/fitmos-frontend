import React from "react";
import { useDispatch } from "react-redux";
import { setItemValue } from "../../redux/post/actions";

const ShareDropDown = ({post})=>{
  const dispatch = useDispatch();
  const openSharing=()=>{
    dispatch(setItemValue({name:'openShareCustomers',value:true}));
    if(post)dispatch(setItemValue({name:'selectedPostId',value:post.id}));
  }
  return (
    <div className="share">
      <i className="fal fa-paper-plane cursor-pointer"  onClick={openSharing}/>
    </div>
  )
}
export default ShareDropDown;