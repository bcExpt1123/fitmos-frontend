import React,{ useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import {deletePost, openEditModal, setItemValue} from "../../redux/post/actions";
import { follow, unfollow, mute } from "../../redux/notification/actions";
import DropDown from "../../components/DropDown";
import LinkProfile from "./customer/Link";
import ReportModal from "./ReportModal";

export default function PostContent({post, newsfeed,suggested,modalShow}) {
  const currentUser = useSelector(({ auth }) => auth.currentUser);
  const renderWord = (word)=>{
    const follower = post.contentFollowers.filter(customer=>word===`$${customer.id}$`);
    return <>
      {follower.length>0?
        <button className="follower-button dropbtn font-weight-bold" onClick={handleClick(follower[0])}>
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
    setRefresh(refresh + 1);
  }
  const openEditPostModal = (post)=>()=>{
    dispatch(openEditModal(post));
    if(modalShow === true)dispatch(setItemValue({name:"openEditModal",value:true}));
    setRefresh(refresh + 1);
  }
  const handleFollow = ()=>{
    dispatch(setItemValue({name:"suggested",value:1}))
    dispatch(follow(post.customer_id));
    setRefresh(refresh + 1);
  }
  const handleUnfollow = ()=>{
    dispatch(setItemValue({name:"suggested",value:0}));
    dispatch(unfollow(post.customer_id));
    setRefresh(refresh + 1);
  }
  const handleMute = ()=>{
    if(suggested)dispatch(setItemValue({name:"suggested",value:1}))
    else dispatch(setItemValue({name:"suggested",value:0}))
    dispatch(mute(post.customer_id));
    setRefresh(refresh + 1);
  }
  const SHOW_LESS_TEXT = 'Show Less';
  const SHOW_MORE_TEXT = 'Read More';
  const [showMore, setShowMore] = useState(false);
  const toggleReadMore = ()=>{
    setShowMore(!showMore);
  }
  const [refresh, setRefresh] = useState(false);
  const handleReport=()=>{
    setRefresh(refresh + 1);
    setShowReportModal(true);
  }  
  const [showReportModal, setShowReportModal] = useState(false);
  const onReportModalClose = ()=>{
    setShowReportModal(false);
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
        <DropDown refresh={refresh}>
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
                    {post.customer.following&&post.customer.following.status ==='accepted'&&<a className={"dropdown-item"} onClick={handleUnfollow}>Unfollow&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                    {/* {post.customer.following == null && <a className={"dropdown-item"} onClick={handleFollow}>Follow&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>} */}
                    {(newsfeed === true && post.customer.relation == false) && <a className={"dropdown-item"} onClick={handleMute}>Hide all posts from&nbsp; <span className="font-weight-bold">{post.customer.first_name}  {post.customer.last_name}</span></a>}
                    <a className={"dropdown-item"} onClick={handleReport}>Report Post</a>
                  </>
                }
              </div>
            </div>    
          )}
        </DropDown>
        <ReportModal type={"post"} post={post} show={showReportModal} onClose={onReportModalClose}/>
        <span>
          <span className="full-name">
            <NavLink
              to={"/"+post.customer.username}
              className={"link-profile font-weight-bold"}
            >
              {post.customer.first_name} {post.customer.last_name}
            </NavLink>
          </span>
          {(post.customer_id != currentUser.customer.id&&post.customer.following == null && newsfeed) &&(
            <span className={"cursor-pointer"} style={{color:"#008EB2"}} onClick={handleFollow}>
              &nbsp;&nbsp;&nbsp;Follow
            </span>
          )}        
          {(post.tagFollowers&&post.tagFollowers.length>0 || post.location)&&<span className="font-weight-bold">&nbsp;is</span>}
          {(post.location && post.location!='false')&&<span className="font-weight-bold">&nbsp;in {post.location}</span>}
          {post.tagFollowers&&post.tagFollowers.length>0&&<>&nbsp;with</>}
          &nbsp;
          {
            post.tagFollowers&&post.tagFollowers.map((follower)=>(
              <span key={follower.id} className="follower">
                <span className="follower font-weight-bold"><LinkProfile id={follower.id} display={follower.first_name+' '+follower.last_name}/></span>
                <span className="spot">, &nbsp;</span>
              </span>
            ))
          }
        </span>
      </div>
      <div className="post-body">
        {post.json_content && <>
          {post.json_content.length>5?
          <>
            {showMore?<>
              {post.json_content.map((line, index)=>
                (index<post.json_content.length-1)?
                  <div key={index}>{renderPostLine(line)}</div>
                  :
                  <div key={index}>{renderPostLine(line)}
                    <button 
                      onClick={toggleReadMore}
                      className="read-more__button"
                    >
                      {SHOW_LESS_TEXT}
                    </button>              
                  </div>
              )}
            </>:<>
              <div>{renderPostLine(post.json_content[0])}</div>
              <div>{renderPostLine(post.json_content[1])}</div>
              <div>{renderPostLine(post.json_content[2])}</div>
              <div>{renderPostLine(post.json_content[3])}</div>
              <div>{renderPostLine(post.json_content[4])}<span>…</span>
                <button 
                  onClick={toggleReadMore}
                  className="read-more__button"
                >
                  {SHOW_MORE_TEXT}
                </button>          
              </div>
            </>            
            }
          </>
          :
          <>
            {post.json_content.map((line,index)=>
              <div key={index}>{
                renderPostLine(line)
                }
              </div>)
            }          
          </>
          }
          </>
        }
      </div>
    </>
  );
}