import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const PageHeader = ({title,tagLine, breadcrumb})=>{
  const currentUser = useSelector(({auth})=>auth.currentUser);
  return (
    <header className="page-title">
      <h2>{breadcrumb?(
        breadcrumb.map((item, index)=>
          <NavLink
            title={item.name}
            to={`/shop/companies/${item.id}`}
            key={index}
          >
            {item.name} 
            {
              item.arrow&&(
                <>
                  &nbsp;
                  &#129082;
                  &nbsp;
                </>
              )
            }
          </NavLink> 
        )
      ):(
        <>
        {title}
        </>
      )}
      </h2>
      <div className="sub-title">{currentUser.current_date}</div>            
      <div className="tag-line">{tagLine}</div>
    </header>
  )
}
export default PageHeader;
