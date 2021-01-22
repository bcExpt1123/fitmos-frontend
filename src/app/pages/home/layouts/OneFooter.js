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
      {children}
      <Footer />
    </>
  )  
}  
export default OneColumn;