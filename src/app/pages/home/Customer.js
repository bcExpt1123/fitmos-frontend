import React, { useEffect } from "react";
import MetaTags from "react-meta-tags";
import { useSelector, useDispatch } from "react-redux";
import ThreeColumn from "./layouts/Three";
import TwoColumn from "./layouts/Two";
import { findCustomerPosts, appendCustomerPostsAfter } from "./redux/post/actions";
import Posts from "./social/sections/Posts";
import ProfileInfo from "./profile/ProfileInfo";
import SharingPostPopup from "./social/sections/SharingPostPopup";
import RightBarProfile from "./social/sections/RightBarProfile";
import LikersModal from "./social/sections/LikersModal";
import { isMobile } from "../../../_metronic/utils/utils";
import SplashScreen from "../../../app/partials/layout/SplashScreen";

export default function Customer({id}) {
  const posts = useSelector(({post})=>post.customerPosts);
  const username = useSelector(({people})=>people.username);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const last = useSelector(({post})=>post.customerPostsLast);
  const loading = useSelector(({post})=>post.customerPostsFirstLoading);
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
      <title>{username?username.first_name + ' ' + username.last_name:""} - Fitemos </title>
      <meta
        name="description"
        content="Customer Profile - Fitemos"
      />
      </MetaTags>
      {(username.profile==='public' || username.following && (username.following.status == 'accepted') || username.id == currentUser.customer.id)?
        <ThreeColumn>
          { isMobile() && (
            <div className="customer-profile-section newsfeed">
              <ProfileInfo customer={username}/>
              <RightBarProfile />
            </div>
          )}
          {
            loading ? (
              <div className="loading" style={{marginTop:"200px", marginBottom:"200px"}}>
                <SplashScreen />
              </div>
            ) : (
              <>
                {posts.length>0?
                  <Posts posts={posts} last={last} dispatchAction={dispatchAction}  show={currentUser.customer.id == id} newsfeed={false} topMonitor={"customerPosts"}/>
                  :
                  <div className="absolute center">
                    <div className="item">
                      <div className="second-text"> Sin publicaciones</div>
                    </div>
                  </div>
                } 
              </> 
            )
          }
          <SharingPostPopup />
          <LikersModal />
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