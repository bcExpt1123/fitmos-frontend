/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, {useEffect, useState, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { fetchDialogs, setItemValue } from "../../redux/dialogs/actions"; 
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import {lastDate} from "../../../../../lib/common";
import ContextMenu from './components/ContextMenu';
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { getImageLinkFromUID } from './helper/utils';


const ListDialog = ()=> {
  const clickDialog = (dialog)=>{
    dispatch(setItemValue({name:'selectedDialog',value:dialog}));
    dispatch(setItemValue({name:'route',value:'channel'}));
  }
  const dispatch = useDispatch();
  const dialogs = useSelector(({dialog})=>dialog.dialogs);
  const [filteredDialgos, setFilteredDialogs] = useState([]);
  useEffect(()=>{
    dispatch(fetchDialogs());
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
  useEffect(()=>{
    if(dialogs.length>0)setFilteredDialogs(dialogs);
  },[dialogs]);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  const newDialog = ()=>{
    dispatch(setItemValue({name:'route',value:'newPrivate'}));
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
  const actionLoading = useSelector(({dialog})=>dialog.actionLoading);
  const [searchFieldShow, setSearchFieldShow] = useState(false);
  const searchFieldDisplay=()=>{
    setSearchFieldShow(!searchFieldShow);
  }
  useEffect(()=>{
    if(searchFieldShow) searchRef.current.focus();
  },[searchFieldShow])
  const searchFieldClose=()=>{
    setSearchFieldShow(false);
    setSearchValue("");
  }
  const [searchValue, setSearchValue] = useState("");
  const handleSearchValue = (evt)=>{
    setSearchValue(evt.target.value);
    if(evt.target.value!=""){
      const filtered = dialogs.filter(dialog=>{
        const users = dialog.users.filter(customer=>customer.display.toLowerCase().includes(evt.target.value.toLowerCase()));
        if(users.length>0) return true;
        if(dialog.type==2){
          return dialog.name.toLowerCase().includes(evt.target.value.toLowerCase());
        }
        return false;
      });
      setFilteredDialogs(filtered);
    }else{
      setFilteredDialogs(dialogs);
    }
  }
  const searchRef = useRef();
  const lastActivityClassName = (diffTime)=>{
    const className = "fas fa-circle";
    if(diffTime<1800){
      return className + " online";  
    }
    if(diffTime<3600){
      return className;
    }
    return className + " offline";
  }
  const handleChatClose = ()=>{
    dispatch(setItemValue({name:"showPanel",value:false}));
  }
  const convertMessage = (message)=>{
    if(message === null )return "";
    const regexp = /(@\[.+?\]\([0-9]+\))/g;
    const mentionReg = /@\[(.+?)\]\(([0-9]+)\)/g;
    const content = message;
    const newWords = content.split(regexp);
    let jsonWords = [];
    for(let i = 0; i < newWords.length; i++){
      let word;
      if(newWords[i]!=="" && newWords[i]!==undefined){
        const matches = [...newWords[i].matchAll(mentionReg)];
        if(matches.length>0){
          word = {
            type:"customer",
            // word:newWords[i],
            id:matches[0][2],
            word:'@'+matches[0][1]
          }
        }else{
          word = {
            type:"p",
            word:newWords[i]
          }
        }
        jsonWords[i] = word;
      }
    }
    return jsonWords.map(word=>word.word).join(' ');
  }
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
        <div className="dialogs-header">
          <div className="sub-header">
            <div className="title">
              <i className="cursor-pointer fal fa-window-close" onClick={handleChatClose}/>
              {searchFieldShow ? <div className="search-controls">
                <input className="" value={searchValue} onChange={handleSearchValue} ref={searchRef}/>
                <button className="search-close btn" onClick={searchFieldClose}>Cancel</button>
              </div>
              :
              <span>Chat</span>
              }
            </div>
            <div className="actions">
              <i className="cursor-pointer fal fa-search" title="Search" onClick={searchFieldDisplay}/>
              <i className="cursor-pointer fal fa-plus-circle" title="New Chat"  onClick={newDialog}/>
              <i className="cursor-pointer fal fa-user-friends" title="New Group" onClick={newGroupDialog}/>
            </div>
          </div>
        </div>
        {/* <button className="new-chat" onClick={newGroupDialog}><i className="fas fa-user-friends"/>&nbsp;New Group chat</button> */}
        <div className="kt-notification-v2 list-dialogs" ref={contextMenuWrapper}>
        { 
          actionLoading?
          <div className="dialog-loader vh-centered">
              <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
            </div>
          :
          (filteredDialgos.length === 0)?
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
            
              {filteredDialgos.map(dialog=>
                <span className="kt-notification-v2__item cursor-pointer" key={dialog._id} onClick={()=>clickDialog(dialog)} onContextMenu={handleContextMenu(dialog)}>
                  <div className="kt-notification-v2__item-icon">
                    {dialog.type==3 && dialog.users && dialog.users[0] && dialog.users[0].avatarUrls && <>
                      <img src={dialog.users[0].avatarUrls['small']} alt={dialog.users[0].first_name +' '+ dialog.users[0].last_name}/>
                      {dialog.last_activity&&<i className={lastActivityClassName(dialog.last_activity)} />}
                    </>}
                    {dialog.type==2 && dialog.photo && <img src={getImageLinkFromUID(dialog.photo)} alt={dialog.name}/>}
                  </div>
                  <div className="kt-notification-v2__itek-wrapper">
                    <div className="kt-notification-v2__item-desc" style={{color:"#0C2A49"}}>
                      <div className="info-left">
                        <h5>
                          {dialog.type==3 && dialog.users && dialog.users[0] && <>{dialog.users[0].first_name} {dialog.users[0].last_name}</>}
                          {dialog.type==2 && <>{dialog.name}</>}
                        </h5>
                        <span className="last-message">{dialog.last_message === '' ? "No messages yet" : convertMessage(dialog.last_message)}</span>
                      </div>
                      <div className="info-right">
                        <p>{lastDate({
                          lastDate: dialog.last_message_date_sent || Date.parse(dialog.updated_at) / 1000 || Date.parse(dialog.created_at) / 1000,
                          lastMessage: dialog.last_message || '',
                          updatedDate: Date.parse(dialog.updated_at) || Date.now(),
                        })}</p>
                        {dialog.unread_messages_count > 0 ?
                          <span className="unread-message">{dialog.unread_messages_count}</span>
                          :<span>&nbsp;</span>
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