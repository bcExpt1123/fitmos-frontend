import React from 'react';
import { resizeImage } from '../../../../../../lib/common';

export default function ImageUpload({onUpload, id}){
  const onChange = (event)=>{
    resizeImage({
      file: event.target.files[0],
      maxSize: 500
    }).then(function (resizedImage) {
      console.log("upload resized image",resizedImage)
      onUpload(resizedImage);
    }).catch(function (err) {
      console.error(err);
    });
  }
  return (
    <div className="image-upload">
      <label htmlFor="file-upload" className="custom-file-upload" >
        <div className="vh-centered">
            <input name="imagefile[]" type="file" id={"file-upload"} accept="image/*" onChange={onChange} style={{display:'none'}}/>
            <i className="fa fa-camera" />
        </div>
      </label>
    </div>
  )  
}
