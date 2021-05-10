import React from "react";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import classnames from "classnames";
import Line from "./DisplayMentionLine";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const SearchPosts = ({posts, keyword}) => {
  const displayContent = (content)=>{
    const lines = content.split("\n");
    return lines.map((line, index)=>(
      <span key={index}>
        <Line line={line} link={true}/>&nbsp;
      </span>
    ))
  }
  return <>
    {posts.length==0?
      <>No hay resultados sobre "{keyword}".</>:
      posts.map(post=>(
        <div className="item" key={post.id}>
          <NavLink
            to={"/posts/"+post.id}
            className={""}
          >
            {post.medias&&<>
              {post.medias.length==0?<>
                <img src={toAbsoluteUrl("/media/products/no-image.png")} alt="no image" />
              </>:
                post.medias[0].type === 'video'?
                <video src = {post.medias[0].url} />:<img src={post.medias[0].url} alt={"logo"}/>
              }
            </>}
            <div className="body" >
              <div className="content">{displayContent(post.content)}</div>
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
