import React,{ useEffect, useState } from "react";
import { useSWRInfinite } from "swr";
import { NavLink } from "react-router-dom";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview/web";
import { httpApi } from "../../services/api";
import FollowButton from "../../social/sections/FollowButton";
import "../../assets/scss/theme/explore/member.scss";

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.data.customers.length) return null // reached the end
  return `search/members?page=${pageIndex+1}`
}

const MemberComponent = ({scrollWidth, scrollHeight, marginLeft}) => {

  const { data, mutate, size, setSize } = useSWRInfinite(
    (...args) => getKey(...args), httpApi
  );
  let customers = []
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  })
  if(data) data.forEach(item=>customers = customers.concat(item.data.customers))
  dataProvider = dataProvider.cloneWithRows(customers)
  //
  const [layoutProvider, setLayoutProvider] = useState(new LayoutProvider(
    index => 1,
    (type,dim) => {
      const bodyClientWidth = document.querySelector('body').clientWidth;
      dim.width = bodyClientWidth;
      dim.height = 85;
    },
  ));
  const followButtonCallback = ()=>{
    setTimeout(()=>{mutate()}, 2000);
  }
  const rowRenderer = (type,customer) => {
    return <div className="item container">
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
      <FollowButton customer={customer} afterAction={followButtonCallback}/>
    </div>
  }
  const handleListEnd = () => {
    setSize(size + 1)    
  }
  useEffect(()=>{
    setLayoutProvider(new LayoutProvider(
      index => 1,
      (type, dim) => {
        const bodyClientWidth = document.querySelector('body').clientWidth;
        dim.width = bodyClientWidth;
        dim.height = 85;
      },
    ));
  },[scrollWidth, scrollHeight]);
  return (
    <>
      <div className='data-wrapper' >
        {dataProvider._data.length>0 && scrollWidth>0 && (
          <RecyclerListView
            style={{
              width: scrollWidth,
              height: scrollHeight,
              marginLeft: marginLeft
            }}
            contentContainerStyle={{ margin: 3 }}
            onEndReached={handleListEnd}
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            renderAheadOffset={0}
            rowRenderer={rowRenderer}
          />        
        )}
      </div>
    </>
  );
};

export default MemberComponent;