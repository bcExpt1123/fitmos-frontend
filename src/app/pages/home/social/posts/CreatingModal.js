import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import classnames from "classnames";
import { Modal } from "react-bootstrap";
import { MentionsInput, Mention } from 'react-mentions';
import Chip from '@material-ui/core/Chip';
// import defaultStyle from "./defaultStyle";
import TagFollower from '../sections/TagFollower';
import SearchLocation from '../sections/SearchLocation';
const users = [
  {
    id: 1,
    display: "Walter White"
  },
  {
    id: 2,
    display: "Jesse Pinkman"
  },
  {
    id: 3,
    display: 'Gustavo "Gus" Fring'
  },
  {
    id: 4,
    display: "Saul Goodman"
  },
  {
    id: 5,
    display: "Hank Schrader"
  },
  {
    id: 6,
    display: "Skyler White"
  },
  {
    id: 7,
    display: "Mike Ehrmantraut"
  }
];
const CreatePostModal = ({show, handleClose}) => {
  const dispatch = useDispatch();
  const [errors,setErrors] = useState([]);
  const [content, setContent] = useState("");
  const [type, setType] = useState("post");
  useEffect(()=>{
    setSearchableCustomers(users);
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
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
              markup="{{__id__}}"
              className="creating-post-mention"
            >
              <Mention
                trigger="@"
                data={users}
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
                <span className="cursor-pointer">
                  <i className="far fa-file-image" />
                </span>
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