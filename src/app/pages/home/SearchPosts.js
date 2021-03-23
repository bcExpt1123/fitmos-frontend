import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import * as qs from 'query-string';
import OneColumn from "./layouts/One";
import { searchPosts } from "./redux/people/actions";
import SearchPosts from "./social/sections/SearchPosts";
import { useInfiniteScroll } from "../../../lib/useInfiniteScroll";
import SharingPostPopup from "./social/sections/SharingPostPopup";
import LikersModal from "./social/sections/LikersModal";

const Search = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const parsed = qs.parse(window.location.search);
    if (parsed.search) {
      dispatch(searchPosts(parsed.search));
    }
  },[]);
  const posts = useSelector(({people})=>people.searchPosts);
  const last = useSelector(({people})=>people.postLast);
  useEffect(() => {
    setIsFetching(false);
  }, [posts]);// eslint-disable-line react-hooks/exhaustive-deps
  const fetchMoreListItems = ()=>{
    if(!last)dispatch(searchPosts());
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
      <div className="search-posts">
        <div className="label">Posts
        </div>
        <div className="result">
          <SearchPosts posts = {posts} />
        </div>
      </div>
      <SharingPostPopup />
      <LikersModal />
    </OneColumn>
  </>
};

export default Search;
