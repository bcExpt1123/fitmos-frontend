import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import ThreeColumn from "./layouts/Three";
import TwoColumn from "./layouts/Two";
import { findCustomerPosts, appendCustomerPostsAfter } from "./redux/post/actions";
import Posts from "./social/sections/Posts";
import ProfileInfo from "./profile/ProfileInfo";

export default function Customer({id}) {
  const posts = useSelector(({post})=>post.customerPosts);
  const username = useSelector(({people})=>people.username);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.customerPostsLast);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findCustomerPosts(id));
  },[id])
  const dispatchAction = ()=>{
    dispatch(appendCustomerPostsAfter(id));
  }
  return (
    <>
      <MetaTags>
      <title>Customer Profile - Fitemos </title>
      <meta
        name="description"
        content="Customer Posts - Fitemos"
      />
      </MetaTags>
      {(username.profile==='public' || username.following && (username.following.status == 'accepted') || username.id == currentUser.customer.id)?
        <ThreeColumn>
          <div className="customer-profile-section newsfeed">
            <ProfileInfo customer={username}/>
          </div>
          {<Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={currentUser.customer.id == id} newsfeed={false}/>}
        </ThreeColumn>
        :
        <TwoColumn>
          <div className="customer-profile-section newsfeed">
            <ProfileInfo customer={username}/>
          </div>
          <div className="absolute center">
            <div className="item">
              <div className="first-text"> Este Perfil es Privado</div>
              <div className="second-text"> Sigue esta cuenta para ver su contenido</div>
            </div>
          </div>
        </TwoColumn>
      }
    </>
  );
}