import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import * as qs from 'query-string';
import { NavLink } from "react-router-dom";
import OneColumn from "./layouts/One";
import { searchAll } from "./redux/people/actions";
import SearchCustomers from "./social/sections/SearchCustomers";
import SearchCompanies from "./social/sections/SearchCompanies";
import SearchPosts from "./social/sections/SearchPosts";
const Search = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  useEffect(()=>{
    const parsed = qs.parse(window.location.search);
    if (parsed.search) {
      dispatch(searchAll(parsed.search));
      setKeyword(parsed.search);
    }
  },[]);
  const results = useSelector(({people})=>people.searchResult);
  const searchValue = useSelector(({people})=>people.searchValue);
  return <>
    <MetaTags>
      <title>search -Fitemos </title>
      <meta
        name="description"
        content="Search -Fitemos"
      />
    </MetaTags>
    <OneColumn>
      <div className="search-customers">
        <div className="label">
          Personas
          {results.people.length>0&&
            <div>
              <NavLink
                to={"/search-people?search="+searchValue}
                className={""}
              >
                View All
              </NavLink>    
            </div>
          } 
        </div>
        <div className="result">
          <SearchCustomers customers = {results.people} keyword = {keyword}/>
        </div>
      </div>
      <div className="search-shops">
        <div className="label">Shops
          {results.shops.length>0&&
            <div>
              <NavLink
                to={"/search-shops?search="+searchValue}
                className={""}
              >
                View All
              </NavLink>    
            </div>
          } 
        </div>
        <div className="result">
          <SearchCompanies companies = {results.shops} keyword = {keyword}/>
        </div>
      </div>
      <div className="search-posts">
        <div className="label">Posts
          {results.posts.length>0&&
            <div>
              <NavLink
                to={"/search-posts?search="+searchValue}
                className={""}
              >
                View All
              </NavLink>    
            </div>
          } 
        </div>
        <div className="result">
          <SearchPosts posts = {results.posts} keyword = {keyword}/>
        </div>
      </div>
    </OneColumn>
  </>
};

export default Search;
