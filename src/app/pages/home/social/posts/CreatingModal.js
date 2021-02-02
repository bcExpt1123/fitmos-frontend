import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from '../../redux/post/actions';
import FormPostModal from '../sections/FormPostModal';

const CreatePostModal = ({show, handleClose}) => {
  const dispatch = useDispatch();
  /** save  */
  const [saving, setSaving] = useState(false);
  const publishPost=({files, location, tagFollowers, content,id})=>{
    setSaving(true);
    dispatch(createPost({files, location, tagFollowers, content}));
    setTimeout(()=>{
      setSaving(false);
      handleClose();
    },500);
  }
  return (
    <FormPostModal show={show} title={'Crear Post'} handleClose={handleClose} publishPost={publishPost} post={false} saving={saving}/>
  );
}

export default CreatePostModal;