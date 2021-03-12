import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import FollowButton from "./FollowButton";
const SearchCustomers = ({customers, keyword}) => {
  return <>
    {customers.length==0?
      <>There is no results with keyword "{keyword}".</>:
      customers.map(customer=>(
        <div className="item" key={customer.id}>
          <div>
            <NavLink
              to={"/"+customer.username}
              className={""}
            >
              <img src={customer.avatarUrls.small}/>
              <div className="name">
                <div className="fullname">{customer.first_name} {customer.last_name}</div>
                <div className="username">{customer.username}</div>
              </div>
            </NavLink>    
          </div>
          <FollowButton customer={customer} />
        </div>
      ))
    }
  </>
};

export default SearchCustomers;
