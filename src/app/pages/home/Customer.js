import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import ThreeColumn from "./layouts/Three";
import TwoColumn from "./layouts/Two";
import { findCustomerPosts, appendCustomerPostsAfter } from "./redux/post/actions";
import Posts from "./social/sections/Posts";

export default function Customer({match}) {
  const posts = useSelector(({post})=>post.customerPosts);
  const customerProfile = useSelector(({post})=>post.customerProfile);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.customerPostsLast);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(findCustomerPosts(match.params.id));
  },[match.params.id])
  const dispatchAction = ()=>{
    dispatch(appendCustomerPostsAfter(match.params.id));
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
      {customerProfile?
        <ThreeColumn>
          {<Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={currentUser.customer.id == match.params.id}/>}
        </ThreeColumn>
        :
        <TwoColumn>
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