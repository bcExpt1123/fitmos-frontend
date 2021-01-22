import React,{useEffect, useState} from "react";
import MetaTags from "react-meta-tags";
// import {Row} from "react-bootstrap";
// import {Col} from "react-bootstrap";
// import SVG from "react-inlinesvg";

// import ThreeColumn from "./layouts/Three";
// import PageHeader from "./layouts/PageHeader";
// import Account from "./sections/Profile/Account";
// import Details from "./sections/Profile/Details";
// import Objective from "./sections/Profile/Objective";
// import Subscription from "./sections/Profile/Subscription";
// import Email from "./sections/Profile/Email";
// import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import { useSelector, useDispatch } from "react-redux";
import ThreeColumn from "./layouts/Three";
import { findCustomerPosts, appendCustomerPostsAfter } from "./redux/post/actions";
import Posts from "./social/sections/Posts";


const ProfilePage = () => {
  const posts = useSelector(({post})=>post.customerPosts);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.customerPostsLast);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findCustomerPosts(currentUser.customer.id));
  },[])
  const dispatchAction = ()=>{
    dispatch(appendCustomerPostsAfter(currentUser.customer.id));
  }
  return(
  <>
    <MetaTags>
      <title>Profile -Fitemos </title>
      <meta
        name="description"
        content="Profile -Fitemos"
      />
    </MetaTags>
    <ThreeColumn>
      {/* <PageHeader title={`Mi Cuenta`}/>
      <Row className="profile">
        <Col xs={12} md={6}>
          <Account />
          <Details />
        </Col>
        <Col xs={12} md={6}>
          <Objective />
          <Subscription />
          <Email />
        </Col>
      </Row>
      <div className="profile-footer">
        &nbsp;&nbsp;
        <a href="https://www.instagram.com/fitemoslatam/" target='_blank' rel="noopener noreferrer">
          <img src={toAbsoluteUrl("/media/icons/png/social/instagram.png")} alt="instagram"/>
        </a>
        &nbsp;&nbsp;
        <a href="https://www.facebook.com/fitemoslatam/" target='_blank' rel="noopener noreferrer">
          <img src={toAbsoluteUrl("/media/icons/png/social/facebook.png")} alt="facebook"/>
        </a>
        &nbsp;&nbsp;
        <a href="https://www.youtube.com/channel/UCI_YlVV3NhzHr2HoYp0LcVw" target='_blank' rel="noopener noreferrer">
          <img src={toAbsoluteUrl("/media/icons/png/social/youtube.png")} alt="youtube"/>
        </a>

      </div> */}
        {<Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={true}/>}
    </ThreeColumn>
  </>
)};

export default ProfilePage;
