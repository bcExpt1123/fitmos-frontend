import React,{ useEffect, useState } from "react";
import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview/web";
import { httpApi } from "../../services/api";

const MemberPage = () => {
  // const { data } = useSWR(`user/me`, httpApi);
  const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => {
    return r1 !== r2;
  }));
  const [scrollWidth, setScrollWidth] = useState(400);
  const [layoutProvider, setLayoutProvider] = useState(new LayoutProvider(
    index => 1,
    (type, dim) => {
      dim.width = scrollWidth;
      dim.height = scrollWidth;
    },
  ));
  const rowRenderer = () => {

  }
  const handleListEnd = () => {

  }
  return (
    <>
      <MetaTags>
        <title>MIEMBROS - Fitemos </title>
        <meta
          name="description"
          content="MIEMBROS -Fitemos"
        />
      </MetaTags>
      <section className="member">
        <RecyclerListView
          style={{ flex: 1 }}
          contentContainerStyle={{ margin: 3 }}
          onEndReached={handleListEnd}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          renderAheadOffset={0}
          rowRenderer={rowRenderer}
        />        
      </section>
    </>
  );
};

export default MemberPage;