import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import ChatHeader from "./ChatHeader";
import { setItemValue } from "../../redux/dialogs/actions"; 

const NewGroupDialog = ()=>{
  const groupName = useSelector(({dialog})=>dialog.groupName);
  const dispatch = useDispatch();
  const changeDialogName = (event) => (dispatch(setItemValue({name:"groupName",value:event.target.value})));
  const nextScreen=() =>{
    dispatch(setItemValue({name:"route",value:"addUsers"}));
  }
  return <div className="create-dialog-container">
      <ChatHeader title="New Group Chat"/>
    <div className="create-dialog-body">
      <div className="create-dialog-body-groupinfo">
        {/* <ImagePicker getImage={this.getImage} /> */}
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
}
export default NewGroupDialog;