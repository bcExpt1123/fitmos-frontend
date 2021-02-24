import React,{ useState, useEffect } from 'react';
import { useDispatch,useSelector } from "react-redux";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import { Tooltip } from '@material-ui/core';
import { compose } from "recompose";
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';
import SVG from "react-inlinesvg";
import Avatar from "../../components/Avatar";
import {deletePost, openEditModal, setItemValue} from "../../redux/post/actions";
import { follow, unfollow, mute } from "../../redux/notification/actions";
import { findWorkouts,initialBlock } from "../../redux/done/actions";
import DropDown from "../../components/DropDown";
import LinkProfile from "./customer/Link";
import ReportModal from "./ReportModal";
import TagFollowersModal from "./customer/TagFollowersModal";
import { convertTime } from "../../../../../lib/common";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
const Map = compose(
  withScriptjs,
  withGoogleMap
)
  (props =>
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: props.markerPosition===null?8.93:props.markerPosition.lat, lng: props.markerPosition===null?-79.66:props.markerPosition.lng }}
      onClick={props.onMapClick}
    >
      {props.isMarkerShown && <Marker position={props.markerPosition} />}
    </GoogleMap>
  )

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
  /** tagFollowersModal */
  const [showTagFollowersModal, setShowTagFollowersModal] = useState(false);
  const openTagFollowersModal = ()=>{
    setShowTagFollowersModal(true);
  }
  const onCloseTagFollowersModal = ()=>{
    setShowTagFollowersModal(false);
  }
  /** google map show */
  const [position, setPosition] = useState(false);
  useEffect(()=>{
    if(post.medias.length == 0 && post.location){
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${post.location}&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,{
        method:"GET",
      })
      .then(response => response.json())
      .then(data => {
        if(data.status == 'OK' && data.results.length>0){
          console.log(data.results[0].geometry);
          setPosition({lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng})
        }
      });
    }
  },[post.medias.length ,post.location])
  const redirectWorkoutPage = ()=>{
    if(post.type === 'workout'){
      dispatch(findWorkouts(post.workout_date));
      dispatch(initialBlock());
      history.push("/");
    }
  }
  const postHeader = ()=>{
    return (<>
      {post.type=="workout"?
        <>
          &nbsp;completed <span onClick={redirectWorkoutPage} className="font-weight-bold cursor-pointer">the workout from {post.workout_spanish_short_date}</span>
        </>:
        <>
          {(post.tagFollowers&&post.tagFollowers.length>0 || post.location)&&<span>&nbsp;is</span>}
          {(post.location && post.location!='false')&&<>
            &nbsp;in&nbsp;<span className="font-weight-bold">
              <a href={`http://www.google.com/maps/search/?api=1&query=`+window.encodeURI(post.location)} target="_blank" className="open-map font-size-14 font-weight-bold">{post.location}</a></span>
            </>}
          {post.tagFollowers&&post.tagFollowers.length>0&&<>&nbsp;with</>}
          &nbsp;
          {
            post.tagFollowers && post.tagFollowers.length>0 &&<>
              &nbsp;<span className="follower font-weight-bold"><LinkProfile id={post.tagFollowers[0].id} display={post.tagFollowers[0].first_name+' '+post.tagFollowers[0].last_name} username={post.tagFollowers[0].username}/></span>
              {post.tagFollowers.length>1&&
                <>
                  &nbsp;and&nbsp;
                  <Tooltip title={
                    post.tagFollowers.map((follower, index)=>{
                      return index>0&&
                      <div key={follower.id} className="follower">
                        {follower.first_name+' '+follower.last_name}
                      </div>
                    })
                  }>
                    <span className="cursor-pointer font-weight-bold" onClick={openTagFollowersModal}>{post.tagFollowers.length - 1} others</span>
                  </Tooltip>  
                  {showTagFollowersModal && <TagFollowersModal show={showTagFollowersModal} onClose={onCloseTagFollowersModal} followers={post.tagFollowers}/>}
                </>
              }
            </>
          }
        </>
      }
    </>)
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
                <i className="fal fa-ellipsis-h dropbtn" />
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
        <span style={{display:"inline-block",verticalAlign:"super"}}>
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
          {!modalShow&&postHeader()}
        </span>
        <div className="post-time" >{convertTime(post.created_at)}</div>
      </div>
      <div className={classnames("post-body",{'post-modal-show':modalShow,'read-more-show':showMore})}>
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
      {(post.medias.length==0 && position) &&<div>
        <Map
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+process.env.REACT_APP_GOOGLE_MAP_KEY}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          isMarkerShown={position.lat===null?false:true}
          markerPosition={position.lat===null?null:{ lat: parseFloat(position.lat), lng: parseFloat(position.lng) }}
        />
      </div>}
      {modalShow&&<div className="font-size-14" style={{padding:"0 23px"}}>
      {(post.tagFollowers&&post.tagFollowers.length>0 || post.location || post.type==="workout")&&<SVG src={toAbsoluteUrl("/media/icons/svg/Design/Minus.svg")} style={{width:"30px"}}/>}
        {postHeader()}</div>
      }
    </>
  );
}