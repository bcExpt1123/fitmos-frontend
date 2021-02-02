import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { MentionsInput, Mention } from 'react-mentions';
import TagFollower from '../sections/TagFollower';
import Avatar from "../../components/Avatar";
import SearchLocation from '../sections/SearchLocation';
import ManageMedias from '../sections/ManageMedias';
import RenderMedia from '../sections/RenderMedia';
import { once } from "../../../../../lib/common";
import SplashScreen from "../../../../partials/layout/SplashScreen";

const FormPostModal = ({show,title,handleClose, publishPost, post, saving}) => {
  const users = useSelector(({people})=>people.people);
  const [content, setContent] = useState("");
  const [type, setType] = useState("post");
  const currentUser = useSelector(({auth})=>auth.currentUser);
  useEffect(()=>{
    if(post){
      setContent(post.content);
      setTagFollowers(post.tagFollowers);
      setFiles(post.medias);
      setLocation(post.location);
    }
  },[post]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if(post && post.tagFollowers && post.tagFollowers.length>0){
      setSearchableCustomers(users.filter((customer)=>!post.tagFollowers.some(item=>item.id == customer.id)));      
    }else{
      setSearchableCustomers(users);
    }
  },[users,post]);// eslint-disable-line react-hooks/exhaustive-deps
  const handleChange = (ev, newValue)=>{
    setContent(newValue);
  }
  const handleBlur = () => (ev, clickedOnSuggestion) => {
    if (!clickedOnSuggestion) {
      console.log("finished editing");
    }
  };
  const openTagFollowers = ()=>{
    setType("tag");
  }
  const openLocationSearch = ()=>{
    setType("location");
  }
  const returnPostScreen = ()=>{
    setType("post")
  }
  const openManageMedias = ()=>{
    setType("medias")
  }
  const filterPeople=(search, callback)=>{
    if(search.length>1){
      const filteredPeople = users.filter((customer)=>customer.display.toLowerCase().includes(search));
      callback(filteredPeople.slice(0, 20));
    }else{
      callback(users.slice(0, 20));
    }
  }
  /** tag */
  const [searchableCustomers, setSearchableCustomers] = useState([]);
  const [tagFollowers, setTagFollowers] = useState([]);
  /** images  vs videos */
  const [files, setFiles] = useState([]);
  const handleCapture = ({ target })=>{
    let clonedFiles = [...files];
    const timestamp = (new Date()).getTime();
    if(files.length+target.files.length>50){
      alert("You can't upload over 50");
      return;
    }
    // if( largeFiles.length > 0 ){
    //   alert("You can't upload over 200Mb");
    //   return;
    // }
    target.files.forEach((file, index) => {
      const type = file.type.includes('image')?"image":"video";
      const url = URL.createObjectURL(file);
      const item = {id:'i'+(index + timestamp),url, type, file }
      clonedFiles.push(item);
    });
    setFiles(clonedFiles);
  }
  const mediaContainerRef = useRef();
  const [mediasWidth,setMediaWidth] = useState(100);
  const [mediaContainerHeight,setMediaContainerHeight] = useState('auto');
  useEffect(()=>{
    // const mediaContainer = document.getElementsByClassName("modal-dialog")[0];
    if(show){
      setMediaWidth(mediaContainerRef.current.clientWidth);
    }
  },[show]);
  useEffect(()=>{
    switch(files.length){
      case 0:
        setMediaContainerHeight("auto");
        break;
      case 1:
        setMediaContainerHeight(mediasWidth+"px");
        break;
      case 2:
        setMediaContainerHeight(mediasWidth/2+"px");
        break;
      case 3:
        setMediaContainerHeight(mediasWidth*1.5+"px");
        break;
      case 4:
        setMediaContainerHeight(mediasWidth+"px");
        break;
      default:
        setMediaContainerHeight(mediasWidth * 5/6+"px");
        break;
      }
  },[files]);
  const removeMedias = ()=>{
    setFiles([]);
  }
  const deleteMedia = (deleteFile)=>{
    setFiles(files.filter(file=>deleteFile.id !==file.id));
  }
  /** searchable location */
  const [location, setLocation] = useState(false);
  const onPublishPost = ()=>{
    const id = post?post.id:false;
    publishPost({files, location, tagFollowers, content,id:id});
  }
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      className="create-post"
      centered
      backdrop="static"
    >
      {type==="post"?(
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            {title}
          </Modal.Title>
        </Modal.Header>
      ):(
        <Modal.Header>
          <span className="cursor-pointer back" onClick={returnPostScreen}><i className="fas fa-arrow-left" /></span>
          {type==="tag"&&
            <Modal.Title className="w-100">
              Tag Followers
            </Modal.Title>
          }
          {type==="location"&&<Modal.Title className="w-100">
              Search for location
            </Modal.Title>
          }
          {type==="medias"&&<Modal.Title className="w-100">
              Edit photos/videos
              <input
                accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                style={{ display: "none" }}
                id="upload-file-button"
                multiple
                type="file"
                max={1024*1024}
                onChange={handleCapture}
              />
              <label htmlFor="upload-file-button" style={{float:'right'}}>
                <span className="cursor-pointer">
                  <i className="far fa-file-image" />
                </span>
              </label>
            </Modal.Title>
          }
        </Modal.Header>
      )}
      <Modal.Body>
        {type==="post"&&
          <>
            {saving&&
              <div className="post-saving">
                <div className="loading">
                  <SplashScreen />                  
                </div>
              </div>
            }
            <div className="author">
              <Avatar pictureUrls={currentUser.avatarUrls} size="xs" />
              <span className="full-name">{currentUser.name}</span>
              {(tagFollowers.length>0 || location)&&<>&nbsp;is</>}
              {location&&<>&nbsp;in {location}</>}
              {tagFollowers.length>0&&<>&nbsp;with</>}
              &nbsp;
              {
                tagFollowers.map((follower)=>(
                  <span key={follower.id} className="follower">
                    <span className="follower">{follower.display}</span>
                    <span className="spot">, &nbsp;</span>
                  </span>
                ))
              }
            </div>
            <MentionsInput 
              value={content} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Escribe algo..."
              className="creating-post-mention"
            >
              <Mention
                trigger="@"
                // markup={'@{$__display__$}(__id__)'}
                data={filterPeople}
                // renderSuggestion={this.renderUserSuggestion}
              />
            </MentionsInput>
            <div className="medias-container">
              <div className="medias-body">
                <div className="medias" ref={mediaContainerRef} style={{height:mediaContainerHeight}}>
                  {files.length == 1&&(
                    <div className="wrapper" style={{top:0,left:0,width:mediasWidth+"px",height:mediasWidth+"px"}}>
                      <div className="item">
                        {RenderMedia(files[0])}
                      </div>
                    </div>
                  )}
                  {files.length > 1&&(
                    <>
                      <div className="wrapper" style={{top:0,left:0,width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                        <div className="item">
                          {RenderMedia(files[0])}
                        </div>
                      </div>
                      <div className="wrapper" style={{top:0,left:mediasWidth/2+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                        <div className="item">
                          {RenderMedia(files[1])}
                        </div>
                      </div>
                    </>
                  )}
                  {files.length == 3&&(
                    <>
                      <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth+"px",height:mediasWidth+"px"}}>
                        <div className="item">
                          {RenderMedia(files[2])}
                        </div>
                      </div>
                    </>
                  )}
                  {files.length == 4&&(
                    <>
                      <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                        <div className="item">
                          {RenderMedia(files[2])}
                        </div>
                      </div>
                      <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth/2+"px",width:mediasWidth/2+"px",height:mediasWidth/2+"px"}}>
                        <div className="item">
                          {RenderMedia(files[3])}
                        </div>
                      </div>
                    </>
                  )}
                  {files.length > 4&&(
                    <>
                      <div className="wrapper" style={{top:mediasWidth/2,left:0+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                        <div className="item">
                          {RenderMedia(files[2])}
                        </div>
                      </div>
                      <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth/3+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                        <div className="item">
                          {RenderMedia(files[3])}
                        </div>
                      </div>
                      <div className="wrapper" style={{top:mediasWidth/2,left:mediasWidth * 2/3+"px",width:mediasWidth/3+"px",height:mediasWidth/3+"px"}}>
                        <div className="item">
                          {RenderMedia(files[4])}
                        </div>
                        {files.length > 5&&
                          <div className="additional">
                            <div>+{files.length - 5}</div> 
                          </div>
                        }
                      </div>
                    </>
                  )}
                </div>
                {files.length>0&&
                  <div className="actions">
                    <div className="cursor-pointer" onClick={openManageMedias}>
                      Edit  
                    </div>
                  </div>
                }
              </div>
              {files.length>0&&
                <div className="remove-all cursor-pointer" onClick={removeMedias}>
                  <div>
                    <i className="fas fa-times" />
                  </div>
                </div>
              }
            </div>
            <div className="create-post-footer mt-3">
              <div className="mt-1" style={{display:"inline-block"}}>
                Agrega
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="cursor-pointer" onClick={openTagFollowers}>
                  <i className="fas fa-hashtag" />
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                  style={{ display: "none" }}
                  id="upload-file-button"
                  multiple
                  type="file"
                  onChange={handleCapture}
                />
                <label htmlFor="upload-file-button">
                  <span className="cursor-pointer">
                    <i className="far fa-file-image" />
                  </span>
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="cursor-pointer" onClick={openLocationSearch}>
                  <i className="fas fa-map-marker-alt" />
                </span>
                </div>
              <button type="button" className="btn btn-primary" disabled={content==""&&files.length===0} onClick={once(onPublishPost)}>Publicar</button>
            </div>
          </>
        }
        {type==="medias"&&
          <ManageMedias 
            files={files}
            deleteMedia={deleteMedia}
            addFile={handleCapture}
          />
        }
        {type==="tag"&&
          <TagFollower 
            searchableCustomers={searchableCustomers} 
            setSearchableCustomers={setSearchableCustomers} 
            tagFollowers={tagFollowers} 
            setTagFollowers={setTagFollowers}
            onClose={returnPostScreen}
          />
        }
        {type==="location"&&
          <SearchLocation setLocation={setLocation} onClose={returnPostScreen}/>
        }
      </Modal.Body>
    </Modal>
  );
}

export default FormPostModal;