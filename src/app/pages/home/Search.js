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
import SharingPostPopup from "./social/sections/SharingPostPopup";
import LikersModal from "./social/sections/LikersModal";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const Search = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const searchResults = useSelector(({people})=>people.searchResult);
  const results = useSelector(({people})=>people.searchPageResults);
  useEffect(()=>{
    const parsed = qs.parse(window.location.search);
    if (parsed.search) {
      dispatch(searchAll({value:parsed.search,done:true}));
      setKeyword(parsed.search);
    }
  },[window.location.search]);
  const searchValue = useSelector(({people})=>people.searchValue);
  return <>
    <MetaTags>
      <title>search -Fitemos </title>
      <meta
        name="description"
        content="Buscar -Fitemos"
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
        <div className="label">Publicaciones
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
      <SharingPostPopup />
      <LikersModal />
    </OneColumn>
  </>
};

export default Search;
