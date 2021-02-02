import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormPostModal from '../sections/FormPostModal';
import { updatePost, closeEditModal } from '../../redux/post/actions';

const EditPostModal = ({show}) => {
  const dispatch = useDispatch();
  const post = useSelector(({post})=>post.editPost);
  /** save  */
  const [saving, setSaving] = useState(false);
  const publishPost=({files, location, tagFollowers, content,id})=>{
    setSaving(true);
    dispatch(updatePost({files, location, tagFollowers, content,id}));
    setTimeout(()=>{
      setSaving(false);
      handleClose();
    },500);
  }
  const handleClose = ()=>{
    dispatch(closeEditModal());
  }
  return (
    <FormPostModal show={show} title={'Edit Post'} handleClose={handleClose} publishPost={publishPost} post={post} saving={saving}/>
  );
}

export default EditPostModal;