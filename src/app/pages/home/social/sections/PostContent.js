import React,{ useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import {deletePost, openEditModal, setItemValue} from "../../redux/post/actions";
import { follow, unfollow, mute } from "../../redux/notification/actions";
import DropDown from "../../components/DropDown";
import LinkProfile from "./customer/Link";

export default function PostContent({post, newsfeed,modalShow}) {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const renderWord = (word)=>{
    const follower = post.contentFollowers.filter(customer=>word===`$${customer.id}$`);
    return <>
      {follower.length>0?
        <button className="follower-button dropbtn" onClick={handleClick(follower[0])}>
          {follower[0].first_name+' '+follower[0].last_name}
        </button>
        :
        <>{word}</>}
    </>
  }
  const history = useHistory();
  const handleClick = (customer)=>()=>{
    history.push("/"+customer.username);
  }
  const renderPostLine = (line)=>{
    const regexp = /(\$[0-9]+\$)/g;
    let content = line.content;
    let res = content.split(regexp);
    return (res.map((word,index)=>{
      return (<React.Fragment key={index}>{
        renderWord(word)
        }
      </React.Fragment>)
      })
    )
  }
  const dispatch = useDispatch();
  const handleDelete = (post)=>()=>{
    dispatch(deletePost(post));
  }
  const openEditPostModal = (post)=>()=>{
    dispatch(openEditModal(post));
    if(modalShow === true)dispatch(setItemValue({name:"openEditModal",value:true}));
  }
  const handleFollow = ()=>{
    dispatch(follow(post.customer_id));
  }
  const handleUnfollow = ()=>{
    dispatch(unfollow(post.customer_id));
  }
  const handleMute = ()=>{
    dispatch(mute(post.customer_id));
  }
  return (
    <>
      <div className="post-header">
        <NavLink
          to={"/"+post.customer.username}
          className={"link-profile"}
        >
          <Avatar pictureUrls={post.customer.avatarUrls} size="xs" />
        </NavLink>        
        <DropDown>
          {({show,toggleHandle})=>(
            <div className=" dropdown">
              <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
                <i className="fas fa-ellipsis-h dropbtn" />
              </button>
              <div className={classnames("dropdown-menu dropdown-menu-right" ,{show})}>
                {
                  post.customer_id == currentUser.customer.id?
                  <>
                    <a className={"dropdown-item"} onClick={openEditPostModal(post)}>Edit Post</a>
                    <a className={"dropdown-item"} onClick={handleDelete(post)}>Delete Post</a>
                  </>
                  :
                  <>
                    {post.customer.following&&post.customer.following.status ==='accepted'&&<a className={"dropdown-item"} onClick={handleUnfollow}>Unfollow <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                    {post.customer.following == null && <a className={"dropdown-item"} onClick={handleFollow}>Follow&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                    {(newsfeed === true && post.customer.relation == false) && <a className={"dropdown-item"} onClick={handleMute}>Hide all posts from&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                    <a className={"dropdown-item"}>Report Post</a>
                  </>
                }
              </div>
            </div>    
          )}
        </DropDown>
        <span>
          <span className="full-name">
            <NavLink
              to={"/"+post.customer.username}
              className={"link-profile"}
            >
              {post.customer.first_name} {post.customer.last_name}
            </NavLink>
          </span>
          {(post.tagFollowers&&post.tagFollowers.length>0 || post.location)&&<>&nbsp;is</>}
          {post.location&&<>&nbsp;in {post.location}</>}
          {post.tagFollowers&&post.tagFollowers.length>0&&<>&nbsp;with</>}
          &nbsp;
          {
            post.tagFollowers&&post.tagFollowers.map((follower)=>(
              <span key={follower.id} className="follower">
                <span className="follower"><LinkProfile id={follower.id} display={follower.first_name+' '+follower.last_name}/></span>
                <span className="spot">, &nbsp;</span>
              </span>
            ))
          }
        </span>
      </div>
      <div className="post-body">
        {post.json_content && post.json_content.map((line,index)=>
          <div key={index}>{
            renderPostLine(line)
            }
          </div>)}
      </div>
    </>
  );
}