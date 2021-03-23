import React,{useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItemValue } from "../../redux/post/actions";

const ShareDropDown = ({post})=>{
  const dispatch = useDispatch();
  const openSharing=()=>{
    dispatch(setItemValue({name:'openShareCustomers',value:true}));
    if(post)dispatch(setItemValue({name:'selectedPostId',value:post.id}));
  }
  const shareRef = useRef();
  return (
    <div className="share">
      <i className="fal fa-paper-plane cursor-pointer"  onClick={openSharing} ref={shareRef}/>
    </div>
  )
}
export default ShareDropDown;