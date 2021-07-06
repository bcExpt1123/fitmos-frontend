import React, {useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import ChatHeader from "./ChatHeader";
import ImagePicker from "./components/ImagePicker";
import { setItemValue } from "../../redux/dialogs/actions"; 

const NewGroupDialog = ()=>{
  const groupName = useSelector(({dialog})=>dialog.groupName);
  const dispatch = useDispatch();
  const changeDialogName = (event) => (dispatch(setItemValue({name:"groupName",value:event.target.value})));
  const nextScreen=() =>{
    dispatch(setItemValue({name:"route",value:"addUsers"}));
    dispatch(setItemValue({name:"backRouteAddUsers",value:"newGroup"}));
  }
  const img = useSelector(({dialog})=>dialog.groupImage);
  const onUpload = (cropper)=>{
    cropper.getCroppedCanvas().toBlob((blob) => {
      const cropedImage = new File([blob], "image.jpg", { type: 'image/jpeg' });
      const image = {
        file:{
          size: cropedImage.size,
          type: cropedImage.type,
          file: cropedImage,
          name: 'croped_image.jpg',
          public: false
        },
        url: URL.createObjectURL(blob)
      }
      dispatch(setItemValue({name:'groupImage',value:image}));
    });

  }

  return <ConnectyCubeWrapper>
      <div className="create-dialog-container">
        <ChatHeader title="Nuevo chat grupal"/>
      <div className="create-dialog-body">
        <div className="create-dialog-body-groupinfo">
          {img?<ImagePicker onUpload={onUpload} url={img.url}/>:<ImagePicker onUpload={onUpload}/>}
          <div className="form-wrapper">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              className="dialog-name"
              onChange={changeDialogName} />
          </div>
        </div>
        <div className="create-dialog-body-btn">
          <button onClick={nextScreen} className="btn-fs-blue" disabled={groupName==="" || groupName.length<3}>
            Next
          </button>
        </div>
      </div>
    </div>
  </ConnectyCubeWrapper>
}
export default NewGroupDialog;