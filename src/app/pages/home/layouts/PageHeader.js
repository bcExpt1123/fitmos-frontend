import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, isMobile } from "../../../../_metronic/utils/utils";

const PageHeader = ({title,tagLine, breadcrumb, backUrl})=>{
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const history = useHistory();
  return (
    <header className="page-title">
      <h2>
        {backUrl&&isMobile()&&<span className="cursor-pointer back" onClick={()=>history.push(backUrl)}><i className="fas fa-arrow-left" /></span>}        
        {breadcrumb?(
        breadcrumb.map((item, index)=>
          <NavLink
            title={item.name}
            to={item.url}
            key={index}
          >
            {item.name} 
            {
              item.arrow&&(
                <>
                &nbsp;
                <SVG src={toAbsoluteUrl("/media/icons/svg/Shopping/next.svg")} width="15px"/>
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
