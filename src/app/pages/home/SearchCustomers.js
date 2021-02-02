import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import * as qs from 'query-string';
import OneColumn from "./layouts/One";
import { searchCustomers } from "./redux/people/actions";
import SearchCustomers from "./social/sections/SearchCustomers";
import useInfiniteScroll from "../../../lib/useInfiniteScroll";

const SearchCustomersPage = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const parsed = qs.parse(window.location.search);
    if (parsed.search) {
      dispatch(searchCustomers(parsed.search));
    }
  },[]);
  const customers = useSelector(({people})=>people.searchCustomers);
  const last = useSelector(({people})=>people.customerLast);
  useEffect(() => {
    setIsFetching(false);
  }, [customers.length]);// eslint-disable-line react-hooks/exhaustive-deps
  const fetchMoreListItems = ()=>{
    if(!last)dispatch(searchCustomers());
    else setIsFetching(false);
  }
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  return <>
    <MetaTags>
      <title>Search people -Fitemos </title>
      <meta
        name="description"
        content="Search people -Fitemos"
      />
    </MetaTags>
    <OneColumn>
      <div className="search-customers">
        <div className="label">
          Personas
        </div>
        <div className="result">
          <SearchCustomers customers = {customers} />
          {isFetching && 'Obteniendo más elementos de la lista...'}
        </div>
      </div>
    </OneColumn>
  </>
};

export default SearchCustomersPage;
