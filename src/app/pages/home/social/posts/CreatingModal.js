import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { Modal } from "react-bootstrap";
import { MentionsInput, Mention } from 'react-mentions';
import Chip from '@material-ui/core/Chip';
// import defaultStyle from "./defaultStyle";
import TagFollower from '../sections/TagFollower';
import SearchLocation from '../sections/SearchLocation';
const CreatePostModal = ({show, handleClose}) => {
  const dispatch = useDispatch();
  const users = useSelector(({people})=>people.people);
  const [errors,setErrors] = useState([]);
  const [content, setContent] = useState("");
  const [type, setType] = useState("post");
  useEffect(()=>{
    setSearchableCustomers(users);
  },[users]);// eslint-disable-line react-hooks/exhaustive-deps
  const handleChange = (ev, newValue)=>{
    setContent(newValue);
    console.log(newValue)
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
  /** tag */
  const [searchableCustomers, setSearchableCustomers] = useState([]);
  const [tagFollowers, setTagFollowers] = useState([]);
  /** images  vs videos */
  const [files, setFiles] = useState([]);
  const handleCapture = ({ target })=>{
    let file = URL.createObjectURL(target.files[0]);
  }
  const filterPeople=(search, callback)=>{
    if(search.length>1){
      const filteredPeople = users.filter((customer)=>customer.display.toLowerCase().includes(search));
      callback(filteredPeople.slice(0, 20));
    }else{
      callback(users.slice(0, 20));
    }
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
            Crear Post
          </Modal.Title>
        </Modal.Header>
      ):(
        <Modal.Header>
          <span className="cursor-pointer back" onClick={returnPostScreen}><i className="fas fa-arrow-left" /></span>
          {type==="tag"?
            <Modal.Title className="w-100">
              Tag Followers
            </Modal.Title>
            :<Modal.Title className="w-100">
              Search for location
            </Modal.Title>
          }
        </Modal.Header>
      )}
      <Modal.Body>
        {type==="post"&&
          <>
            <MentionsInput 
              value={content} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Escribe algo..."
              className="creating-post-mention"
            >
              <Mention
                trigger="@"
                data={filterPeople}
                // renderSuggestion={this.renderUserSuggestion}
              />
            </MentionsInput>
            <div className="create-post-footer mt-3">
              <div className="mt-1" style={{display:"inline-block"}}>
                Agrega
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="cursor-pointer" onClick={openTagFollowers}>
                  <i className="fas fa-hashtag" />
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  accept="image/* | video/*"
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
              <button type="button" className="btn btn-primary" disabled={content==""}>Publicar</button>
            </div>
          </>
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
          <SearchLocation />
        }
      </Modal.Body>
    </Modal>
  );
}

export default CreatePostModal;