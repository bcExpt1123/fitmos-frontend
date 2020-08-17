import React from 'react';  
import SideBar from "../sections/SideBar";
import RightBar from "../sections/RightBar";

  
const ThreeColumn = ({children}) => {  
  return (  
    <div className="wrapper three-column">
      <SideBar />
      <div id="content">
        <div className="page-main">
          <div className="container">
            {children}        
          </div>
        </div>
      </div>
      <RightBar />
    </div>
  )  
}  
export default ThreeColumn;