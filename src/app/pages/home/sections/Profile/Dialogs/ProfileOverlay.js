import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from "react-redux";
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from "react-intl";
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';

import fileSizeLessThan from '../../../components/DropNCrop/util/fileSizeLessThan';
import fileType from '../../../components/DropNCrop/util/fileType';
import "../../../assets/scss/theme/react-drop-n-crop.css";
import { deleteProfileImage as deleteProfileImageAction } from "../../../redux/userSettings/actions";

const ProfileOverlay = (props) => {//setUploadImage
  const [show, setShow] = useState(false);
  const maxFileSize = 3145728;
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  useEffect(
    function () {
      props.setUploadImage(show);
    },
    [show]);// eslint-disable-line react-hooks/exhaustive-deps
  // Upload
  const cropOptions = {
    guides: true,
    viewMode: 1,
    aspectRatio: 1 / 1,
    autoCropArea: 1
  }
  const [preshow, setPreShow] = useState('none')
  const [dropState, setDropState] = useState({
    result: props.url,
    cropper: null,
    filename: null,
    filetype: null,
    src: null,
    error: null,
  })
  const [cropper, setCropper] = useState(null);
  const onDropChange = (value) => {
    setDropState(value);
    setPreShow('block');
  }
  const cropperRef = useRef();
	/*const onCroped = (value) => {
		setDropState(value);
		setPreShow('block');
	} */
  const onClose = () => {
    setShow(false);
    setPreShow('none');
  }
  const onUpload = () => {
    props.onUpload(cropper);
    setShow(false);
    setPreShow('none');
  }
  const onCroped = (cropper) => {
    setCropper(cropper);
  }
  const onDrop = useCallback(files => {
    setShow(true);
    const fileSizeValidation = fileSizeLessThan(maxFileSize)(files);
    const fileTypeValidation = fileType(allowedFileTypes)(files);

    if (fileSizeValidation.isValid && fileTypeValidation.isValid) {
      const reader = new FileReader();
      reader.onload = () => {
        onDropChange({
          src: reader.result,
          filename: files[0].name,
          filetype: files[0].type,
          result: reader.result,
          error: null,
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      onDropChange({
        error: !fileTypeValidation.isValid
          ? fileTypeValidation.message
          : !fileSizeValidation.isValid ? fileSizeValidation.message : null, // TODO: Update error state to be an array to handle both messages if necessary
      });
    }
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  const dispatch = useDispatch();
  const deleteProfileImage = () =>{
    if(window.confirm('¿Estás segura de eliminar la imagen de tu perfil?')){
      dispatch(deleteProfileImageAction());
    }
  }
  const _crop=()=>{
    if (cropperRef.current && cropperRef.current.cropper) {
      onCroped(
        cropperRef.current.cropper
      );
    }
  }
  const onCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() !== 'undefined') {
      onDropChange({
        ...dropState,
        result: cropperRef.current.cropper.getCroppedCanvas().toDataURL(dropState.filetype),
        cropper:cropperRef.current.cropper
      });
    }
  };

  return (
    <div className="profile-img-over dropzone1">
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
      {props.avatar&&(
        <div className="profile-overlay-icon trash" onClick={deleteProfileImage}>
          <i className="fa fa-trash" />
        </div>
      )}

      <Modal show={show} onHide={onClose} centered>
        <Modal.Header>
          <FormattedMessage id={`SettingsForm.PROFILE_RFRAME_PRO_MODAL_TITLE`} />
        </Modal.Header>
        <Modal.Body>
          <Row gutter={[16, 0]}>
            <Col xs="12" md="4">
              <img src={dropState.result} className="rounded-circle" width="150" height="150" alt="drop-state-result"/>
              <div style={{ display: preshow }}>
                <span className="upload-img-preview" >Tu imagen de perfil:{dropState.filename}</span>
              </div>
            </Col>
            <Col xs="12" md="8">
              <Cropper
                ref={cropperRef}
                src={dropState && dropState.src}
                style={{
                  height: "180px",
                  width: "299px",
                }}
                crop={_crop}
                cropend={onCrop} // Only use the cropend method- it will reduce the callback/setState lag while cropping
                {...cropOptions}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={onClose}>
            <FormattedMessage id={`SettingsForm.PROFILE_RFRAME_COVER_MODAL_BTN_CANCEL`} />
          </Button>
          <Button variant="primary" size="sm" onClick={onUpload}>
            <FormattedMessage id={`SettingsForm.PROFILE_RFRAME_PRO_MODAL_BTN`} />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ProfileOverlay;