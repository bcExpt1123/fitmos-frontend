import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from "./ChatHeader";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import { setItemValue, addNewDialog, createdDialog, addedUsersDialog } from "../../redux/dialogs/actions"; 
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { getRandomSubarray } from "../../../../../lib/common";
import ChatService from "../../services/chat-service";
import { useSelector, useDispatch } from "react-redux";

const NewPrivateDialog = ()=>{
  const [keyword, setKeyword] = useState("");
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const changeSearch = (event) => (setKeyword(event.target.value));
  const [isLoader, setIsLoader] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [originalContactedUserIds, setOriginalContactedUserIds] = useState([]);
  const [moreUsers, setMoreUsers] = useState([]);
  const dialogs = useSelector(({dialog})=>dialog.dialogs);
  const people = useSelector(({people})=>people.people);
  const privateProfiles = useSelector(({people})=>people.privateProfiles);
  const path = useSelector(({dialog})=>dialog.backRouteAddUsers);
  const dispatch = useDispatch();
  useEffect(()=>{ 
    let userIds = [];
    dialogs.forEach(dialog=>{
      dialog.occupants_ids.forEach(id=>{
        if(currentUser.chat_id!=id)userIds.push(id);
      })
    })
    userIds = userIds.filter((v, i, a) => a.indexOf(v) === i);
    setOriginalContactedUserIds(userIds);
    searchRef.current.focus();
  },[]);
  const searchUsers = () => {
    let str = keyword.trim();
    if(str === "") {
      const customers = people.filter(customer=>{
        if(customer.user_id == currentUser.id) return false;
        if( customer.chat_id === null )return false;
        if( originalContactedUserIds.includes(customer.chat_id)) return false;
        return (customer.display.toLowerCase().includes(str.toLowerCase()) || customer.username.toLowerCase().includes(str.toLowerCase()));
      });      
      if(customers.length>5){
        setMoreUsers(getRandomSubarray(customers, 5));
      }else{
        setMoreUsers(customers);
      }
      return;
    }
    setIsLoader(true);
    const moreCustomers = people.filter(customer=>{
      if(customer.user_id == currentUser.id) return false;
      if( customer.chat_id === null )return false;
      if( originalContactedUserIds.includes(customer.chat_id)) return false;
      return (customer.display.toLowerCase().includes(str.toLowerCase()) || customer.username.toLowerCase().includes(str.toLowerCase()));
    });
    setMoreUsers(moreCustomers);
    setIsLoader(false);
  }
  useEffect(()=>{
    searchUsers();
  },[keyword, originalContactedUserIds]);
  const saveDialog = () => {
    if(selectedUser == null)return;
    setIsLoader(true);
    //create group dialog
    ChatService.createPrivateDialog({type:3, occupants_ids:[selectedUser.chat_id]})
    .then((newDialog) => {
      setIsLoader(false);
      ChatService.sendChatAlertOnCreate(newDialog)
      dispatch(addNewDialog(newDialog));
    })
    .catch((error) => {
      console.log(error);
      setIsLoader(false);
    })
  }
  const triggerUser = (user)=>()=>{
    if(selectedUser && selectedUser.id == user.id )setSelectedUser(null);
    else setSelectedUser(user);
  }
  const uncheckUsers = (user)=>{
    if(selectedUser === null) return true;
    return selectedUser.id !== user.id;
  }
  const searchRef = useRef();
  return <ConnectyCubeWrapper>
    <div className="create-dialog-container">
      <ChatHeader path={path} title={"Create new Chat"}>
        <div className="dialog-btn">
          <button onClick={saveDialog} className="btn-fs-blue" disabled={selectedUser===null}>Done</button>
        </div>
      </ChatHeader>
      {isLoader &&
        <div className="dialog-loader">
          <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
        </div>
      }
      <div className="create-dialog-body">
        <input
          type="text"
          value={keyword}
          onChange={changeSearch}
          required
          placeholder="Search"
          autoComplete="off"
          className="search-people"
          ref = {searchRef}
          name="search" />

        <div className="create-dialog-body-selected-users">
          {selectedUser &&
            <button
              className="create-dialog-body-selected-avatar"
              onClick={triggerUser(selectedUser)}
            >
              <div className="avatar">
                <img src={selectedUser.avatarUrls['small']} alt={selectedUser.first_name +' '+ selectedUser.last_name}/>
                <div>
                  <i className="fas fa-times-circle" />
                </div>
              </div>
              <div className="first_name">{selectedUser.first_name}</div>
            </button>            
          }
        </div>

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
        { moreUsers.length>0 && <div className="more-users">
          People
          {moreUsers.map(user=>
            <div className="more-user" key={user.id}>
              <div className="avatar">
                <img src={user.avatarUrls['small']} alt={user.first_name +' '+ user.last_name}/>
              </div>
              <div className="info">
                <div className="name">{user.first_name} {user.last_name}</div>
                <div className="username">
                  @{user.username}
                </div>
              </div>
              <div className={classnames("checkbox",{uncheck:uncheckUsers(user)})} onClick={triggerUser(user)}>
                <i className="fas fa-check-circle" />
              </div>
            </div>
          )}
        </div> }
        </PerfectScrollbar>
      </div>
    </div>
  </ConnectyCubeWrapper>
}
export default NewPrivateDialog;