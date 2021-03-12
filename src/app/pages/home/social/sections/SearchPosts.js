import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import classnames from "classnames";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const SearchPosts = ({posts, keyword}) => {
  return <>
    {posts.length==0?
      <>There is no results with keyword "{keyword}".</>:
      posts.map(post=>(
        <div className="item" key={post.id}>
          <NavLink
            to={"/posts/"+post.id}
            className={""}
          >
            {post.medias.length==0?<>
              <img src={toAbsoluteUrl("/media/products/no-image.png")} alt="no image" />
            </>:
              post.medias[0].type === 'video'?
              <video src = {post.medias[0].url} />:<img src={post.medias[0].url} alt={"logo"}/>
            }
            <div className="body" >
              <div className="content">{post.content}</div>
              <div className="post-footer">
                <div className="likes">
                  <span><i className={classnames(" fa-heart cursor-pointer",{like:post.like,fas:post.like,far:post.like==false} )} /> {post.likesCount}</span>
                  <span><i className="far fa-comment" /> {post.commentsCount}</span>
                </div>
                <div className="share">
                  <SVG src={toAbsoluteUrl("/media/icons/svg/Social/share.svg")} />
                </div>
              </div>
            </div>  
          </NavLink>    
        </div>
      ))
    }
  </>
};

export default SearchPosts;
