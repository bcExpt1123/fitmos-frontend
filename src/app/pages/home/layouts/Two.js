import React from 'react';  
// import SideBar from "../sections/SideBar";
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import NavBarSocial from "../components/NavBar/Social";
import SideBar from "../profile/SideBar";

  
const TwoColumn = ({children}) => {  
  const currentUser = useSelector(({auth})=>auth.currentUser);
  return (  
    <>
      {currentUser?
        <NavBarSocial />:
        <NavBar />
      }
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
    </>
  )  
}  
export default TwoColumn;