import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import * as qs from 'query-string';
import OneColumn from "./layouts/One";
import { searchCompanies } from "./redux/people/actions";
import SearchCompanies from "./social/sections/SearchCompanies";
import { useInfiniteScroll } from "../../../lib/useInfiniteScroll";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const SearchCompaniesPage = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const parsed = qs.parse(window.location.search);
    if (parsed.search) {
      dispatch(searchCompanies(parsed.search));
    }
  },[]);
  const companies = useSelector(({people})=>people.searchCompanies);
  const last = useSelector(({people})=>people.companyLast);
  useEffect(() => {
    setIsFetching(false);
  }, [companies]);// eslint-disable-line react-hooks/exhaustive-deps
  const fetchMoreListItems = ()=>{
    if(!last)dispatch(searchCompanies());
    else setIsFetching(false);
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

  return <>
    <MetaTags>
      <title>search -Fitemos </title>
      <meta
        name="description"
        content="Search -Fitemos"
      />
    </MetaTags>
    <OneColumn>
      <div className="search-shops">
        <div className="label">Shops</div>
        <div className="result">
          <SearchCompanies companies = {companies} />
        </div>
      </div>
    </OneColumn>
  </>
};

export default SearchCompaniesPage;
