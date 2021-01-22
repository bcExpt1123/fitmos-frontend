import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

const SearchCompanies = ({companies}) => {
  return <>
    {companies.length==0?
      <>There is no items.</>:
      companies.map(company=>(
        <div className="item" key={company.id}>
          <NavLink
            to={"/shop/companies/"+company.id}
            className={""}
          >
            <img src={company.logo} alt={company.name + "logo"}/>
            <div className="body">
              <div className="name">{company.name}</div>
              <div className="content">{company.description}</div>
            </div>
          </NavLink>    
        </div>
      ))
    }
  </>
};

export default SearchCompanies;
