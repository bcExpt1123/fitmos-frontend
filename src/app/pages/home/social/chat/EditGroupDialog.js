import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import ChatHeader from "./ChatHeader";
import ImagePicker from "./components/ImagePicker";
import { updateGroupName, setItemValue, leaveGroupDialog, updateGroupDialogImage, deleteGroupDialog } from "../../redux/dialogs/actions"; 
import { getImageLinkFromUID } from './helper/utils';

const EditGroupDialog = ()=>{
  const groupName = useSelector(({dialog})=>dialog.groupName);
  const path = useSelector(({dialog})=>dialog.backRouteEditDialog);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const dispatch = useDispatch();
  const changeDialogName = (event) => (dispatch(setItemValue({name:"groupName",value:event.target.value})));
  const nextScreen=() =>{
    dispatch(setItemValue({name:"route",value:"addUsers"}));
    dispatch(setItemValue({name:"backRouteAddUsers",value:"editGroup"}));
  }
  const [editShow, setEditShow] = useState(false);
  const saveGroupName = ()=>{
    dispatch(updateGroupName());
    setEditShow(false);
  }
  const removeUser = (user)=>()=>{
    dispatch(leaveGroupDialog(user));
  }
  const onUpload = (cropper)=>{
    cropper.getCroppedCanvas().toBlob((blob) => {
      const cropedImage = new File([blob], "image.jpg", { type: 'image/jpeg' });
      const image = {
        size: cropedImage.size,
        type: cropedImage.type,
        file: cropedImage,
        name: 'croped_image.jpg',
        public: false
      }
      dispatch(updateGroupDialogImage(image));
    });
  }
  const deleteDialog = ()=>{
    if(window.confirm("¿Estás seguro que deseas eliminar este grupo?")){
      dispatch(deleteGroupDialog({id:currentUser.chat_id}));
      dispatch(setItemValue({name:"route",value:"list"}));
    }
  }
  
  return <ConnectyCubeWrapper>
    <div className="create-dialog-container">
      <ChatHeader title={currentUser.chat_id == selectedDialog.user_id?"Ajustes de Chat Grupal":selectedDialog.name} path={path}/>
      <div className="create-dialog-body">
        <div className="create-dialog-body-groupinfo">
          {currentUser.chat_id == selectedDialog.user_id&&
            <>
              <ImagePicker onUpload={onUpload} url={getImageLinkFromUID(selectedDialog.photo)} />
              <div className="form-wrapper">
                {editShow ?<>
                    <div className="group-name">
                      <input
                      type="text"
                      placeholder=" Nombre del grupo"
                      value={groupName}
                      className="dialog-name"
                      onChange={changeDialogName} />
                    </div>
                    <div className="action">
                      <i className="fa fa-check" onClick={saveGroupName}/>
                    </div>
                  </>
                  :
                  <>
                    <div className="group-name">
                      {groupName}
                    </div>
                    <div className="action">
                      <i className="fa fa-pencil-alt" onClick={()=>setEditShow(true)}/>
                    </div>
                  </>
                }
              </div>
            </>
          }
          {selectedDialog!=null&&false&&
            <div className="created-user">Nombre del grupo {
              currentUser.chat_id == selectedDialog.user_id?<>you</>
              :<>{selectedDialog.owner.display}</>
            }</div>
          }
        </div>
        <div className="participants">
          <label>{selectedDialog.occupants_ids.length} Participantes</label>
          {currentUser.chat_id == selectedDialog.user_id&&
            <>
              <button onClick={nextScreen} className="btn-fs-blue" disabled={groupName==="" || groupName.length<3}>
                Agregar Personas
              </button>
              &nbsp;&nbsp;&nbsp;
              <button onClick={deleteDialog} className="btn-fs-waring">
                Borrar Grupo
              </button>
            </>
          }
          {selectedDialog.users.map(user=><div className="participant-info other" key={user.id}>
            <div className="avatar">
              <img src={user.avatarUrls['small']} alt={user.first_name +' '+ user.last_name}/>
            </div>
            <div className="name">
              {user.first_name} {user.last_name}
            </div>
            {currentUser.chat_id == selectedDialog.user_id && <button className="participant-delete" onClick={removeUser(user)}>Remove</button>}
          </div>)
          }
          <div className="participant-info">
            <div className="avatar">
              <img src={currentUser.avatarUrls['small']} alt={currentUser.customer.first_name +' '+ currentUser.customer.last_name}/>
            </div>
            <div className="name">
              {currentUser.customer.first_name} {currentUser.customer.last_name}
            </div>
          </div>          
        </div>
      </div>
    </div>
  </ConnectyCubeWrapper>
}
export default EditGroupDialog;