/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, {useEffect, useState, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { fetchDialogs, setItemValue } from "../../redux/dialogs/actions"; 
import Avatar from "../../components/Avatar";
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import {lastDate} from "../../../../../lib/common";
import ContextMenu from './components/ContextMenu';


const ListDialog = ()=> {
  const clickDialog = (dialog)=>{
    dispatch(setItemValue({name:'selectedDialog',value:dialog}));
    dispatch(setItemValue({name:'route',value:'channel'}));
  }
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchDialogs(true));
    dispatch(setItemValue({name:'selectedDialog',value:null}));
    function handleContextMenu(event){
      if ( !contextMenuWrapper.current.contains(event.target)) {
        var contentMenus = document.getElementsByClassName("chat-content-menu");
        var i;
        for (i = 0; i < contentMenus.length; i++) {
          var openContextMenu = contentMenus[i];
          if (openContextMenu.style.opacity === '1') {
            console.log(openContextMenu.style.opacity, typeof openContextMenu.style.opacity)
            openContextMenu.style.opacity = 0;
          }
        }
      }
    }
    document.addEventListener("contextmenu", handleContextMenu);
    return ()=>{
      document.removeEventListener("contextmenu", handleContextMenu);
    }
  },[]);
  const dialogs = useSelector(({dialog})=>dialog.dialogs);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  const newDialog = ()=>{
    dispatch(setItemValue({name:'route',value:'new'}));
  }
  const newGroupDialog = ()=>{
    dispatch(setItemValue({name:'groupName',value:''}));
    dispatch(setItemValue({name:'route',value:'newGroup'}));
  }
  const handleContextMenu = (dialog)=>(event)=>{
    event.preventDefault();
    dispatch(setItemValue({name:'selectedDialog',value:dialog}));
  }
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const contextMenuWrapper = useRef();
  return (
    <ConnectyCubeWrapper>
      <PerfectScrollbar
        options={{
          wheelSpeed: 2,
          wheelPropagation: false
        }}
        style={{
          maxHeight: "calc(100vh - 100px)",
          position: "relative"
        }}
      >
        {/* <button className="new-chat" onClick={newDialog}><i className="fas fa-user"/>&nbsp;New chat</button> */}
        <button className="new-chat" onClick={newGroupDialog}><i className="fas fa-user-friends"/>&nbsp;New Group chat</button>
        <div className="kt-notification-v2 list-dialogs" ref={contextMenuWrapper}>
        { (dialogs.length === 0)?
          <div className="notification-title">
            No Chats
          </div>              
          :
          <>
            {/* <ViewableMonitor visibleChange = {visibleChange}>
            {isViewable =>
              <span>&nbsp;</span>
            }
            </ViewableMonitor> */}
          
            {dialogs.map(dialog=>
              <span className="kt-notification-v2__item cursor-pointer" key={dialog._id} onClick={()=>clickDialog(dialog)} onContextMenu={handleContextMenu(dialog)}>
                <div className="kt-notification-v2__item-icon">
                  {dialog.type==3 && <img src={dialog.users[0].avatarUrls['small']} alt={dialog.users[0].first_name +' '+ dialog.users[0].last_name}/>}
                  {/* {dialog.type==2 && <img src={dialog.users[0].avatarUrls['small']} alt={dialog.users[0].first_name +' '+ dialog.users[0].last_name}/>} */}
                </div>
                <div className="kt-notification-v2__itek-wrapper">
                  <div className="kt-notification-v2__item-desc" style={{color:"#0C2A49"}}>
                    <div className="info-left">
                      <h5>
                        {dialog.type==3 && <>{dialog.users[0].first_name} {dialog.users[0].last_name}</>}
                        {dialog.type==2 && <>{dialog.name}</>}
                      </h5>
                      <span>{dialog.last_message === '' ? "No messages yet" : dialog.last_message}</span>
                    </div>
                    <div className="info-right">
                      <p>{lastDate({
                        lastDate: dialog.last_message_date_sent || Date.parse(dialog.updated_at) / 1000 || Date.parse(dialog.created_at) / 1000,
                        lastMessage: dialog.last_message || '',
                        updatedDate: Date.parse(dialog.updated_at) || Date.now(),
                      })}</p>
                      {dialog.unread_messages_count > 0 &&
                        <span>{dialog.unread_messages_count}</span>
                      }
                    </div>
                  </div>
                </div>
              </span>
            )}     
            <ContextMenu wrapper={contextMenuWrapper}>
              {(selectedDialog && selectedDialog.type === 2) &&     
                <ul>
                  {currentUser.chat_id == selectedDialog.user_id?<>
                    <li data-action={'editGroupDialogAction'}>Manage Group</li>
                    <li data-action={'deleteGroupDialogAction'}>Delete Group</li>
                  </>:<>
                    <li data-action={'leaveGroupDialogAction'}>Leave Group</li>
                  </>}
                </ul>
              }
            </ContextMenu>
          </>
          }
        </div>
      </PerfectScrollbar>
    </ConnectyCubeWrapper>
  );
}
export default ListDialog;