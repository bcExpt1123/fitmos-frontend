import React from 'react';  
import { useSelector } from "react-redux";
// import Sticky from "wil-react-sticky";
import ProfileInfo from "./ProfileInfo";

const SideBar = () => {  
  const customer = useSelector(({people})=>people.username);
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