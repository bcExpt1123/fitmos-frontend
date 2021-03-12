import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import { searchAll } from "../../../redux/people/actions";

const SearchResult = ({value,clearValue})=>{
  const dispatch = useDispatch();
  const searchResult = useSelector(({people})=>people.searchResult);
  const history = useHistory();
  const openSearchPage = ()=>{
    history.push("/search?search="+value);
    clearValue();
  }
  useEffect(()=>{
    if(value!="")dispatch(searchAll({value}));
  },[value]);
  return (
    <>
      <div className={classnames("dropdown-menu",{show:value!=""})}>
        {searchResult.people.length > 0&&
          <>
            <div>Personas</div>  
            {
              searchResult.people.map((customer)=>(
                <NavLink
                  to={"/"+customer.username}
                  className={"dropdown-item"}
                  activeClassName="active"
                  exact
                  key = {customer.id}
                >
                  {customer.first_name} {customer.last_name}
                </NavLink>                
              ))
            }
          </>
        }
        {searchResult.shops.length > 0&&
          <>
            <div className="mt-2">Shops</div>  
            {
              searchResult.shops.map((company)=>(
                <NavLink
                  to={"/"+company.username}
                  className={"dropdown-item"}
                  activeClassName="active"
                  exact
                  key = {company.id}
                >
                  {company.name}
                </NavLink>                
              ))
            }
          </>
        }
        <button className="open-search-button mt-2" onClick={openSearchPage}>
          <i className="fas fa-search"/> &nbsp;Search for {value}
        </button>
      </div>
    </>    
  )
}
export default SearchResult;