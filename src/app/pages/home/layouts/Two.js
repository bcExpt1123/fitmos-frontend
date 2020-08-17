import React from 'react';  
import SideBar from "../sections/SideBar";

  
const TwoColumn = ({children}) => {  
  return (  
    <div className="wrapper two-column">
      <SideBar />
      <div id="content">
        <div className="page-main">
          <div className="container">
            {children}        
          </div>
        </div>
      </div>
    </div>
  )  
}  
export default TwoColumn;