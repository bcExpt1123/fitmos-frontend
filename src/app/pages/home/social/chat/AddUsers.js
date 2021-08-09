import React, { useState, useEffect } from 'react';
import ChatHeader from "./ChatHeader";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import { setItemValue, addNewDialog, createdDialog, addedUsersDialog } from "../../redux/dialogs/actions"; 
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import ChatService from "../../services/chat-service";
import { useSelector, useDispatch } from "react-redux";

const AddUsers = ()=>{
  const [keyword, setKeyword] = useState("");
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const changeSearch = (event) => (setKeyword(event.target.value));
  const [isLoader, setIsLoader] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [originalContactedUsers, setOriginalContactedUsers] = useState([]);
  const [contactedUsers, setContactedUsers] = useState([]);
  const [moreUsers, setMoreUsers] = useState([]);
  const dialogs = useSelector(({dialog})=>dialog.dialogs);
  const people = useSelector(({people})=>people.people);
  const privateProfiles = useSelector(({people})=>people.privateProfiles);
  const groupName = useSelector(({dialog})=>dialog.groupName);
  const path = useSelector(({dialog})=>dialog.backRouteAddUsers);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  const dispatch = useDispatch();
  useEffect(()=>{ 
    let userIds = [];
    dialogs.forEach(dialog=>{
      dialog.occupants_ids.forEach(id=>{
        if(currentUser.chat_id!=id)userIds.push(id);
      })
    })
    userIds = userIds.filter((v, i, a) => a.indexOf(v) === i);
    if(selectedDialog){
      userIds = userIds.filter(id=>!selectedDialog.occupants_ids.includes(id));
    }
    const users = userIds.map(chat_id=>{
      const user = people.find(customer=>chat_id==customer.chat_id);
      if(user)return user;
      const privateUser = privateProfiles.find(customer=>chat_id==customer.chat_id);
      return privateUser;
    }).filter(customer=> {if(customer && customer.id)return customer});
    setOriginalContactedUsers(users);
    setContactedUsers(users);
  },[]);
  const searchUsers = () => {
    let str = keyword.trim();
    if(str === "") {
      setMoreUsers([]);
      return;
    }
    const contactedCustomers = originalContactedUsers.filter(customer=>customer.display.toLowerCase().includes(str.toLowerCase()) || customer.username.toLowerCase().includes(str.toLowerCase()));
    setContactedUsers(contactedCustomers);
    if (str.length > 0) {
      setIsLoader(true);
      const moreCustomers = people.filter(customer=>{
        const u = originalContactedUsers.find(user=>user.id === customer.id);
        if( u ) return false;
        if(customer.user_id == currentUser.id) return false;
        if( customer.chat_id === null )return false;
        if( selectedDialog && selectedDialog.occupants_ids.includes(customer.chat_id)) return false;
        return (customer.display.toLowerCase().includes(str.toLowerCase()) || customer.username.toLowerCase().includes(str.toLowerCase()));
      });
      setMoreUsers(moreCustomers);
      setIsLoader(false);
    } else {
      // swal('Warning', `Enter more than 3 characters`)
    }
  }
  useEffect(()=>{
    searchUsers();
  },[keyword]);
  const img = useSelector(({dialog})=>dialog.groupImage);
  const saveDialog = () => {
    let str = groupName.trim()
    if (str.length < 3) {
      // return swal('Warning', 'Enter more than 4 characters for group subject')
    }
    const occupants_ids = selectedUsers.map(elem => {
      return elem.chat_id
    })
    setIsLoader(true);
    if(selectedDialog){
      //add users to group
      ChatService.addUsersDialogs(selectedDialog._id, occupants_ids)
      .then((dialog) => {
        setIsLoader(false);
        dispatch(addedUsersDialog(dialog));
      })
      .catch((error) => {
        console.log(error);
        setIsLoader(false);
      })
    }else{
      //create group dialog
      const newImage = img?img.file:null;
      ChatService.createPublicDialog(occupants_ids, str, newImage)
      .then((newDialog) => {
        setIsLoader(false);
        ChatService.sendChatAlertOnCreate(newDialog)
        dispatch(addNewDialog(newDialog));
        dispatch(createdDialog(newDialog));
      })
      .catch((error) => {
        console.log(error);
        setIsLoader(false);
      })
    }
  }
  const _renderSelectedUsers = (elem) => {
    return (
      <button
        key={elem.id}
        className="create-dialog-body-selected-avatar"
        onClick={triggerUsers(elem)}
      >
        <div className="avatar">
          <img src={elem.avatarUrls['small']} alt={elem.first_name +' '+ elem.last_name}/>
          <div>
            <i className="fas fa-times-circle" />
          </div>
        </div>
        <div className="first_name">{elem.first_name}</div>
      </button>
    )
  }
  const triggerUsers = (user)=>()=>{
    let users = selectedUsers.filter(selectedUser=>selectedUser.id !== user.id);
    if(users.length === selectedUsers.length){
      users = [...selectedUsers,user];
    }
    setSelectedUsers(users);
  }
  const uncheckUsers = (user)=>{
    const result =  selectedUsers.filter(selectedUser=>selectedUser.id === user.id)
    return result.length === 0;
  }
  return <ConnectyCubeWrapper>
    <div className="create-dialog-container">
      <ChatHeader path={path} title={selectedDialog?"Agregar al grupo":"Create new Group"}>
        <div className="dialog-btn">
          <button onClick={saveDialog} className="btn-fs-blue" disabled={selectedUsers.length===0}>Aceptar</button>
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
          placeholder="Buscar"
          autoComplete="off"
          className="search-people"
          name="search" />


        {selectedUsers.length > 0 &&
          <div className="create-dialog-body-selected-users">
            {selectedUsers.map(elem => (
              _renderSelectedUsers(elem)
            ))
            }
          </div>
        }
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
        { contactedUsers.length>0 && <div className="contacted-users">
          Personas
          {contactedUsers.map(user=>
            <div className="contacted-user" key={user.id}  onClick={triggerUsers(user)}>
              <div className="avatar">
                <img src={user.avatarUrls['small']} alt={user.first_name +' '+ user.last_name}/>
              </div>
              <div className="name">
                {user.first_name} {user.last_name}
              </div>
              <div className={classnames("checkbox",{uncheck:uncheckUsers(user)})}>
                <i className="fas fa-check-circle" />
              </div>
            </div>
          )}
        </div> }
        { moreUsers.length>0 && <div className="more-users">
          More Personas
          {moreUsers.map(user=>
            <div className="more-user" key={user.id} onClick={triggerUsers(user)}>
              <div className="avatar">
                <img src={user.avatarUrls['small']} alt={user.first_name +' '+ user.last_name}/>
              </div>
              <div className="info">
                <div className="name">{user.first_name} {user.last_name}</div>
                <div className="username">
                  @{user.username}
                </div>
              </div>
              <div className={classnames("checkbox",{uncheck:uncheckUsers(user)})}>
                <i className="fas fa-check-circle" />
              </div>
            </div>
          )}
        </div> }
        {contactedUsers.length === 0 && moreUsers.length === 0 && keyword.trim().length>2&&
          <> Not found people</>
        }
        </PerfectScrollbar>
      </div>
    </div>
  </ConnectyCubeWrapper>
}
export default AddUsers;