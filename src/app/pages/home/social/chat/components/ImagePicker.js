import React, { useState, useRef, useCallback } from 'react'
import Cropper from 'react-cropper';
import Dropzone from 'react-dropzone';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import fileSizeLessThan from '../../../components/DropNCrop/util/fileSizeLessThan';
import fileType from '../../../components/DropNCrop/util/fileType';
import { deleteGroupDialogImage } from "../../../redux/dialogs/actions";


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    padding: 0,
    boxShadow: '2px 2px 25px 0px black'
  }
}

export default function ImagePicker({onUpload, url}){
  const maxFileSize = 3145728;
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const cropOptions = {
    guides: true,
    viewMode: 1,
    aspectRatio: 1 / 1,
    autoCropArea: 1
  }
  const [show, setShow] = useState(false);
  const [cropper, setCropper] = useState(null);
  const cropperRef = useRef();
  const dispatch = useDispatch();
  const [dropState, setDropState] = useState({
    result: url,
    cropper: null,
    filename: null,
    filetype: null,
    src: null,
    error: null,
  })
  const _crop=()=>{
    if (cropperRef.current && cropperRef.current.cropper) {
      setCropper(cropperRef.current.cropper);
    }
  }
  const onCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() !== 'undefined') {
      setDropState({
        ...dropState,
        result: cropperRef.current.cropper.getCroppedCanvas().toDataURL(dropState.filetype),
        cropper:cropperRef.current.cropper
      });
    }
  };
  const handleClose = ()=>{
    setShow(false);
    setDropState({
      ...dropState,
      result: url,
    });    
  }
  const onDrop = useCallback(files => {
    setShow(true);
    const fileSizeValidation = fileSizeLessThan(maxFileSize)(files);
    const fileTypeValidation = fileType(allowedFileTypes)(files);

    if (fileSizeValidation.isValid && fileTypeValidation.isValid) {
      const reader = new FileReader();
      reader.onload = () => {
        setDropState({
          src: reader.result,
          filename: files[0].name,
          filetype: files[0].type,
          result: reader.result,
          error: null,
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setDropState({
        error: !fileTypeValidation.isValid
          ? fileTypeValidation.message
          : !fileSizeValidation.isValid ? fileSizeValidation.message : null, // TODO: Update error state to be an array to handle both messages if necessary
      });
    }
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const cropImage = ()=>{
    setShow(false);
    onUpload(cropper);
  }
  const deleteProfileImage = ()=>{
    if(window.confirm('¿Estás segura de eliminar la imagen de tu perfil?')){
      dispatch(deleteGroupDialogImage());
      setDropState({
        ...dropState,
        result: null,
      });      
    }
  }
  return (
    <>
      <div className="image-picker">
        <label htmlFor="file-upload" className="custom-file-upload" >
          {dropState.result && <img src={dropState.result} alt="groupPhoto" style={{ width: 60, height: 60, borderRadius: '50%' }} />} 
          <Dropzone
            className="dropzone"
            activeClassName="dropzone--active"
            onDrop={onDrop}
          >
            {({getRootProps, getInputProps}) => (
              <div className="profile-overlay-icon">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <i className="fa fa-camera" />
                </div>            
              </div>
            )}
          </Dropzone> 
          {dropState.result&&(
            <div className="profile-overlay-icon trash" onClick={deleteProfileImage}>
              <i className="fa fa-trash" />
            </div>
          )}
        </label>
      </div>
      <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      className="create-post"
      >
        <Modal.Body>
          <div className="image-crop-picker-container">
            <Cropper
              ref={cropperRef}
              src={dropState && dropState.src}
              style={{
                height: "300px",
                width: "300px",
              }}
              crop={_crop}
              cropend={onCrop} // Only use the cropend method- it will reduce the callback/setState lag while cropping
              {...cropOptions}
            />
          </div>
          <div className="image-crop-picker-header">
            <button onClick={cropImage}>Next</button>
            <button onClick={handleClose}>Cancel</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )  
}
