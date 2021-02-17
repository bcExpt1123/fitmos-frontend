import React,{useEffect} from 'react';  
import { useDispatch, useSelector } from "react-redux";
import { matchPath } from "react-router-dom";
import Sticky from "wil-react-sticky";
import ProfileInfo from "./ProfileInfo";
import { findCustomer, setItemValue } from "../redux/people/actions";

const SideBar = () => {  
  const customer = useSelector(({people})=>people.username);
  const dispatch = useDispatch();  
  const match = matchPath(window.location.pathname, {
    path:'/customers/:id',
    exact:true,
    strict:true
  });  
  useEffect(()=>{
    if(match&&match.params){
      dispatch(findCustomer(match.params.id));
    }else{
      dispatch(setItemValue({name:'customer',value:false}));
    }
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  return (  
    <div id="sidebar">
      <Sticky offsetTop={130}>
        <ProfileInfo customer={customer}/>
      </Sticky>
    </div>
    )  
}  
export default SideBar;