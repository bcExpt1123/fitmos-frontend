import React,{ useEffect, useState } from 'react';  
import { useSelector } from "react-redux";
import { matchPath } from "react-router-dom";
// import Sticky from "wil-react-sticky";
import ProfileInfo from "./ProfileInfo";

const SideBar = () => {  
  const username = useSelector(({people})=>people.username);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const [customer, setCustomer] = useState(currentUser.customer);
  const match = matchPath(window.location.pathname, {
    path:['/:username','/:username/pictures','/:username/workouts'],
    exact:true,
    strict:true
  });  
  useEffect(()=>{
    if(match&&match.params && match.params.username && username.type){
      if(username.type=="customer" && username.username === match.params.username){
        setCustomer(username);
      }
    }
  },[username])
  return (  
    <div id="sidebar">
      {/* <Sticky offsetTop={130}> */}
        <div style={{position:'relative'}}>
          <div style={{position:'fixed', top:'130px', width:"320px"}}>
            <ProfileInfo customer={customer}/>
          </div>
        </div>
      {/* </Sticky> */}
    </div>
    )  
}  
export default SideBar;