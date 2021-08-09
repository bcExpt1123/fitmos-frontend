import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import * as qs from 'query-string';
import OneColumn from "./layouts/One";
import { searchCustomers } from "./redux/people/actions";
import SearchCustomers from "./social/sections/SearchCustomers";
import { useInfiniteScroll } from "../../../lib/useInfiniteScroll";
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

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
      <title>Buscar people -Fitemos </title>
      <meta
        name="description"
        content="Buscar people -Fitemos"
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
