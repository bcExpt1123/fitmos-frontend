import React from 'react';  
import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import NavBarSocial from "../components/NavBar/Social";
import Footer from "../components/Footer";

  
const OneColumn = ({children}) => {  
  const currentUser = useSelector(({auth})=>auth.currentUser);
  return (  
    <>
      {currentUser?
        <NavBarSocial />:
        <NavBar />
      }
      <div className="wrapper">
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
export default OneColumn;