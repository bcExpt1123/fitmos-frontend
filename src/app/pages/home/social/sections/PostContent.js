import React,{ useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import classnames from "classnames";
import Avatar from "../../components/Avatar";
import {deletePost, openEditModal} from "../../redux/post/actions";

export default function PostContent({post}) {
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
  const handleClick = (customer)=>()=>{
    console.log("Clicked!"+customer.id)
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
  const [show, setShow] = useState(false);
  const toggleHandle = ()=>{
    setShow(!show);
  }
  const dispatch = useDispatch();
  const handleDelete = (post)=>()=>{
    dispatch(deletePost(post));
  }
  const openEditPostModal = (post)=>()=>{
    dispatch(openEditModal(post));
  }
  return (
    <>
      <div className="post-header">
        <Avatar pictureUrls={post.customer.avatarUrls} size="xs" />
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
                {true?<a className={"dropdown-item"}>Hide all posts from username</a>
                  :
                  <a className={"dropdown-item"}>Unfollow username</a>
                }
                <a className={"dropdown-item"}>Report Post</a>
              </>
            }
          </div>
        </div>    
        <span>
          <span className="full-name">{post.customer.first_name} {post.customer.last_name}</span>
          {(post.tagFollowers&&post.tagFollowers.length>0 || post.location)&&<>&nbsp;is</>}
          {post.location&&<>&nbsp;in {post.location}</>}
          {post.tagFollowers&&post.tagFollowers.length>0&&<>&nbsp;with</>}
          &nbsp;
          {
            post.tagFollowers&&post.tagFollowers.map((follower)=>(
              <span key={follower.id} className="follower">
                <span className="follower">{follower.first_name}&nbsp;{follower.last_name}</span>
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