import React from 'react';  
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

  
const OneColumn = ({children}) => {  
  return (  
      <>
        <NavBar />
        {children}
        <Footer />
      </>
  )  
}  
export default OneColumn;