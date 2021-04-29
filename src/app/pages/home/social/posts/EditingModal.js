import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormPostModal from '../sections/FormPostModal';
import { updatePost, closeEditModal, setItemValue } from '../../redux/post/actions';

const EditPostModal = ({show}) => {
  const dispatch = useDispatch();
  const post = useSelector(({post})=>post.editPost);
  /** save  */
  const saving = useSelector(({post})=>post.savingPost);
  const publishPost=({files, location, tagFollowers, content,id})=>{
    dispatch(updatePost({files, location, tagFollowers, content,id}));
    // setTimeout(()=>{
    //   setSaving(false);
    //   handleClose();
    //   dispatch(setItemValue({name:"openEditModal",value:false}));
    // },500);
  }
  useEffect(()=>{
    if(saving){

    }else{
      handleClose();
    }
  },[saving]);

  const handleClose = ()=>{
    dispatch(closeEditModal());
    dispatch(setItemValue({name:"openEditModal",value:false}));    
  }
  return (
    <FormPostModal show={show} title={'Editar Publicación'} handleClose={handleClose} publishPost={publishPost} post={post} saving={saving}/>
  );
}

export default EditPostModal;