import React,{ useEffect, useState } from "react";
import { useSWRInfinite } from "swr";
import { NavLink } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview/web";
import { httpApi } from "../../services/api";
import FollowButton from "../../social/sections/FollowButton";
import "../../assets/scss/theme/explore/member.scss";

const MemberPage = () => {

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    index =>
      `search/members?page=${index+1}`,    httpApi
  );
  let customers = []
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  })
  if(data) data.forEach(item=>customers = customers.concat(item.data.customers))
  dataProvider = dataProvider.cloneWithRows(customers)
  //
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(600);
  const [marginLeft, setMarginLeft] = useState('0');
  const [layoutProvider, setLayoutProvider] = useState(new LayoutProvider(
    index => 1,
    (type, dim) => {
      const bodyClientWidth = document.querySelector('body').clientWidth;
      dim.width = bodyClientWidth;
      dim.height = 85;
    },
  ));
  const rowRenderer = (type, customer) => {
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
      <FollowButton customer={customer} />
    </div>
  }
  const handleListEnd = () => {
    setSize(size + 1)    
  }
  useEffect(()=>{
    window.addEventListener('resize', handleResize);
    const bodyClientWidth = document.querySelector('body').clientWidth;
    const bodyClientHeight = document.querySelector('body').clientHeight;
    setScrollWidth(bodyClientWidth + 12);
    setMarginLeft( (document.getElementById('member').clientWidth - bodyClientWidth)/2 + 'px');
    document.querySelector('body').style.overflowX = 'hidden';
    if(bodyClientWidth>490){
      setScrollHeight(bodyClientHeight - 185);
    }else{
      setScrollHeight(bodyClientHeight - 210);
    }
    return ()=>{
      window.removeEventListener('resize', handleResize);
    }
  },[]);
  const [timer, setTimer] = useState(null);
  const handleResize = () => {
    const member = document.getElementById('member');
    if(member){
      const bodyClientWidth = document.querySelector('body').clientWidth;
      const bodyClientHeight = document.querySelector('body').clientHeight;
      setScrollWidth(document.getElementById('member').clientWidth + (bodyClientWidth - member.clientWidth)/2 + 12);
      setMarginLeft( (document.getElementById('member').clientWidth - bodyClientWidth)/2 + 'px');
      if(bodyClientWidth>490){
        setScrollHeight(bodyClientHeight - 185);
      }else{
        setScrollHeight(bodyClientHeight - 210);
      }
      if (!timer) {
        const timerId = setTimeout(() => {
          clearTimeout(timer)
          setTimer(timer)
          setLayoutProvider(new LayoutProvider(
            index => 1,
            (type, dim) => {
              const bodyClientWidth = document.querySelector('body').clientWidth;
              dim.width = bodyClientWidth;
              dim.height = 85;
            },
          ));
        }, 500)
        setTimer(timerId)
      }
    }
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
      <section className="member" id="member">
        {/* {customers.map(customer=><div key={customer.id}>
          {customer.first_name} {customer.last_name}
        </div>)} */}
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
      </section>
    </>
  );
};

export default MemberPage;