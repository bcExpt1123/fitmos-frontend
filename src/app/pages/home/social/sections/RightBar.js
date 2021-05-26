import React from 'react';  
import { useSelector } from "react-redux";
import Sticky from "wil-react-sticky";
import Other from "./RightBarOther";
import RightBarProfile from "./RightBarProfile";

const RightBar = () => {  
  const username = useSelector(({people})=>people.username);
  return (  
    <div className="rightbar">
      <Sticky offsetTop={130}>
        {username.type === 'customer' && '/'+username.username===window.location.pathname ?
          <RightBarProfile />: <Other />
        }
      </Sticky>
    </div>
    )  
}  
export default RightBar;