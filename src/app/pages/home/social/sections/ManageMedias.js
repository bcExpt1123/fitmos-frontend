import React, { useState } from "react";
import RenderMedia from './RenderMedia';
const ManageMedias = ({files, deleteMedia}) => {
  return (
    <div className="manage-medias">
      {files.map((file, index)=>(
        <div key={index}>
          <RenderMedia file={file} />
          <div className="actions cursor-pointer" onClick={()=>deleteMedia(file)}>
            <div>
              <i className="fas fa-times" />
            </div>
          </div>
        </div>        
      ))}  
    </div>
  );
}

export default ManageMedias;