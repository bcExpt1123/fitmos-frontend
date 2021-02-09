import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from '../../redux/post/actions';
import FormPostModal from '../sections/FormPostModal';

const CreatePostModal = ({show, handleClose}) => {
  const dispatch = useDispatch();
  /** save  */
  const saving = useSelector(({post})=>post.savingPost);
  const publishPost=({files, location, tagFollowers, content,id})=>{
    // setSaving(true);
    dispatch(createPost({files, location, tagFollowers, content}));
    // setTimeout(()=>{
    //   setSaving(false);
    //   handleClose();
    // },500);
  }
  useEffect(()=>{
    if(saving){

    }else{
      handleClose();
    }
  },[saving]);
  return (
    <FormPostModal show={show} title={'Crear Post'} handleClose={handleClose} publishPost={publishPost} post={false} saving={saving}/>
  );
}

export default CreatePostModal;