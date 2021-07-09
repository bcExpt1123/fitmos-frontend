/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import classnames from "classnames";
import { RecyclerListView, DataProvider } from "recyclerlistview/web";
import ConnectyCubeWrapper from './components/ConnectyCubeWrapper';
import ChatHeader from "./ChatHeader";
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import ChatService from '../../services/chat-service';
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { ChatLayoutUtil } from './helper/utils';
import { editGroupDialog, setItemValue, deleteGroupDialog, checkOwnerSelectedDialog } from '../../redux/dialogs/actions';
import { deleteMessage, updateMessageBody } from "../../redux/messages/actions";
import { mute, unmute } from "../../redux/notification/actions";
import { convertTimeSeconds } from "../../../../../lib/common";
import { getImageLinkFromUID } from './helper/utils';
import DropDown from "../../components/DropDown";

const Channel = ()=> {
  const [refresh, setRefresh] = useState(false);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  let title;
  if(selectedDialog){
    if(selectedDialog.type==3){
      if(selectedDialog.users[0])title = selectedDialog.users[0].first_name +' '+ selectedDialog.users[0].last_name;
      else title="";
    }else{
      title = selectedDialog.name;
    }
  }
  const [isAlready, setIsAlready] = useState(false);
  const [isFetchingMsg, setIsFetchingMsg] = useState(false);
  const [layoutProvider, setLayoutProvider] = useState(false);
  const [timer, setTimer] = useState(null);
  const [listenerLazyLoad, setListenerLazyLoad] = useState(false);
  const [needToGetMoreMessage, setNeedToGetMoreMessage] = useState(true);
  const [scrollWidth, setScrollWidth] = useState(400);
  const [scrollHeight, setScrollHeight] = useState(400);
  const [recyclerY, setRecyclerY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const messages = useSelector(({message})=>message);
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const [dataProvider, setDataProvider] = useState(()=>new DataProvider((r1, r2) => {
    return r1 !== r2 || r1.send_state !== r2.send_state
  }));
  const messagesListRef = useRef();
  const dispatch = useDispatch();
  const lazyLoadMessages = (elem, y) => {
    setRecyclerY(y);
    setContentHeight(elem.nativeEvent.contentSize.height);
    if (listenerLazyLoad && needToGetMoreMessage && y < 20) {
      setListenerLazyLoad(false);
      ChatService.getMoreMessages(selectedDialog)
        .then(amountMessages => {
          amountMessages === 21 ? setNeedToGetMoreMessage(true) : setNeedToGetMoreMessage(false);
          setListenerLazyLoad(true);
        })
    }
  }
  const handleResize = () => {
    const chatBody = document.getElementById('chat-body');
    if(chatBody){
      setScrollWidth(chatBody.clientWidth);
      setScrollHeight(chatBody.clientHeight);
      if (!timer) {
        const dialog = selectedDialog;
        const timerId = setTimeout(() => {
          clearTimeout(timer)
          setTimer(timer)
          setIsAlready(true);
          setLayoutProvider(ChatLayoutUtil.getChatLayoutProvider({
            width: scrollWidth,
            dialogId: dialog._id,
            currentUserId: currentUser.chat_id
          }));
        }, 500)
        setTimer(timerId)
        console.log('handleResize')
      }
    }
  }
  const scrollToBottom = () => {
    if (messagesListRef && messagesListRef.current) {
      try{
        messagesListRef.current.scrollToIndex(dataProvider._data.length - 1, false)
      }catch(e){
        console.log(e);
      }
    }
  }
  const [extendedState, setExtendedState] = useState({ids:[],count:0});
  const postMessageIds = useSelector(({dialog})=>dialog.postMessageIds);
  const count = useSelector(({dialog})=>dialog.postMessageCount);
  useEffect(()=>{
    setTimeout(()=>setExtendedState({ids:postMessageIds,count}),700);
  },[postMessageIds,count])
  useEffect(()=>{ 
    setUpdateScollPositionIndex(updateScollPositionIndex+1)    
  },[extendedState]);
  const _renderMessage = (type, item) => {
    // 1 - current sender & 2 - other sender
    let whoIsSender = currentUser.chat_id == item.sender_id ? 1 : 2;
    if(item.sender_id === -1)whoIsSender = 0;
    let notRenderAvatar = null

    if (type > 0 && whoIsSender !== 1 &&
      +dataProvider._data[type - 1].sender_id !== +item.sender_id) {
      notRenderAvatar = true
    }

    return (
      <Message
        whoIsSender={whoIsSender}
        message={item}
        extendedState={extendedState}
        notRenderAvatar={notRenderAvatar}
        widthScroll={scrollWidth}
      />
    )
  }
  const [amountMessages, setAmountMessages] = useState(-1);
  const setDataProviders = (dialog, count)=>{
    if(dialog && messages[dialog._id]){
      count === 21 ? setNeedToGetMoreMessage(true) : setNeedToGetMoreMessage(false);
      setIsFetchingMsg(true);
      setLayoutProvider(ChatLayoutUtil.getChatLayoutProvider({
        width: scrollWidth,
        dialogId: dialog._id,
        currentUserId: currentUser.chat_id
      }));
      const provider = dataProvider.cloneWithRows(messages[dialog._id]);
      setDataProvider(provider);
      scrollToBottom();
      setListenerLazyLoad(true);
    }else{
      setAmountMessages(count);
    }
  }
  useEffect(()=>{
    if(amountMessages>-1){
      setDataProviders(selectedDialog, amountMessages);
    }
  },[amountMessages]);
  const getDialogInfo = async () => {
    const dialog = selectedDialog;

    // get info about occupants  await UsersService.getOccupants(dialog.occupants_ids)

    ChatService.getMessages(dialog)
      // .catch(e => alert(`Error.\n\n${JSON.stringify(e)}`))
      .then(amountMessages => {
        setDataProviders(dialog, amountMessages);
      })
  }
  const [updateScollPositionIndex, setUpdateScollPositionIndex] = useState(0);
  const updateScrollPosition = () => {
    const chatBody = document.getElementById('chat-body');
    if(chatBody && chatBody.children.length>0 && chatBody.children[0].children.length && chatBody.children[0].children[0].children.length>0){
      const getElement = chatBody.children[0].children[0].children[0].style.height;
      const fullScrollHeight = getElement.slice(0, getElement.length - 2)
      const newOffset = recyclerY + (fullScrollHeight - contentHeight);
      messagesListRef.current.scrollToOffset(0, newOffset);
    }else{
      setTimeout(()=>setUpdateScollPositionIndex(updateScollPositionIndex+1), 100);
    }
  }
  useEffect(()=>{
    if(updateScollPositionIndex>0){
      updateScrollPosition();
    }
  },[updateScollPositionIndex]);
  const editMessageState = useSelector(({dialog})=>dialog.editMessageState);
  const selectedMessageId = useSelector(({dialog})=>dialog.selectedMessageId);
  const sendMessageCallback = async (messageText, img) => {
    const dialog = selectedDialog;
    if (messageText.length <= 0 && !img) return
    if(editMessageState) {
      dispatch(updateMessageBody(messageText));
    }
    else await ChatService.sendMessage(dialog, messageText, img, scrollToBottom)
  }
  const handleDocumentClick = (event)=>{
    if(event.target.className == 'fal fa-ellipsis-v dropbtn'){
      console.log(event.target.tagName);
    }else{
      dispatch(setItemValue({name:'openDropdownMenu', value:false}));
    }
  }
  useEffect(()=>{
    setIsFetchingMsg(false);
    getDialogInfo();
    setIsAlready(true);
  },[selectedDialog]);
  useEffect(()=>{
    dispatch(checkOwnerSelectedDialog())
  },[]);
  useEffect(()=>{
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleDocumentClick);
    const chatBody = document.getElementById('chat-body');
    if(chatBody){
      setScrollWidth(document.getElementById('chat-body').clientWidth);
      setScrollHeight(document.getElementById('chat-body').clientHeight);
    }
    return ()=>{
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleDocumentClick);
    }
  },[]);
  useEffect(()=>{
    if ( messages && messages[selectedDialog._id] && messages[selectedDialog._id].length>0 && layoutProvider) {
      const provider = dataProvider.cloneWithRows(messages[selectedDialog._id]);
      setDataProvider(provider);
    }    
  },[messages]);
  useEffect(()=>{
    updateScrollPosition();
  },[dataProvider]);
  const editGroup = ()=>{
    dispatch(editGroupDialog({route:'editGroup',backRouteEditDialog:'channel'}));
  }
  const top = useSelector(({dialog})=>dialog.selectedMessageTop);
  const openDropdownMenu =  useSelector(({dialog})=>dialog.openDropdownMenu);
  const actionLoading =  useSelector(({dialog})=>dialog.actionLoading);
  const openEdit = ()=>{
    dispatch(setItemValue({name:'editMessageState',value:true}));
  }
  const handleDelete = ()=>{
    dispatch(deleteMessage());
  }
  let avatar;
  if(selectedDialog.type==2){
    avatar = getImageLinkFromUID(selectedDialog.photo);
  }else if(selectedDialog.type==3){
    if(selectedDialog.users[0])avatar = selectedDialog.users[0].avatarUrls['small'];
  }
  const history = useHistory();
  const viewProfile = ()=>{
    setRefresh(refresh + 1);
    history.push('/'+ selectedDialog.owner.username);
  }
  const handleMute = ()=>{
    setRefresh(refresh + 1);
    dispatch(mute(selectedDialog.owner.id));
  }
  const handleUnmute = ()=>{
    setRefresh(refresh + 1);
    dispatch(unmute(selectedDialog.owner.id));
  }
  const deleteChat = ()=>{
    dispatch(deleteGroupDialog({id:currentUser.chat_id}));
    dispatch(setItemValue({name:'route',value:'list'}));
    dispatch(setItemValue({name:'selectedDialog', value:null}));
  }
  const readMessageCount = useSelector(({dialog})=>dialog.readMessageCount);
  useEffect(()=>{
    setLayoutProvider(ChatLayoutUtil.getChatLayoutProvider({
      width: scrollWidth,
      dialogId: selectedDialog._id,
      currentUserId: currentUser.chat_id
    }));
    setTimeout(()=>{
      updateScrollPosition();
      scrollToBottom();
    },100)
  },[readMessageCount]);
  const renderWordsCount = useSelector(({dialog})=>dialog.renderWordsCount);
  useEffect(()=>{
    handleResize();
  },[renderWordsCount])
  return (<ConnectyCubeWrapper>
    <div className="chat-container" >
      <ChatHeader avatar = {avatar}>
        <div className="chat-title">
          <h3 className="cursor-pointer" onClick={editGroup}>{title}</h3>
          {selectedDialog.type==2&&<div className="participants">{selectedDialog.occupants_ids.length} participantes</div>}
          {selectedDialog.type==3&&<div className="participants">{false&&selectedDialog.last_activity&&convertTimeSeconds(selectedDialog.last_activity)}</div>}
        </div>
        <DropDown refresh={refresh}>
          {({show,toggleHandle,setShow})=>(
            <div className=" dropdown">
              <button type="button" className={"btn dropbtn"} onClick={toggleHandle}>
                <i className="far fa-bars" />
                
              </button>
              <div className={classnames("dropdown-menu dropdown-menu-right" ,{showmenu:show})}>
                {selectedDialog.type==3&&<a className={"dropdown-item"} onClick={viewProfile}>Ver perfil</a>}
                {selectedDialog.type==3&&<>
                  {selectedDialog.owner.relation === 'muted'?<a className={"dropdown-item"} onClick={handleUnmute}>Quitar silenciado</a>
                  :
                  <a className={"dropdown-item"} onClick={handleMute}>Silenciar</a>}
                </>}
                {selectedDialog.type==2&&<>{
                  selectedDialog.user_id != currentUser.chat_id?<a className={"dropdown-item"} onClick={deleteChat}>Leave Chat</a>
                  :
                  <a className={"dropdown-item"} onClick={editGroup}>Ajustes</a>
                }
                </>}
              </div>
            </div>  
          )}    
        </DropDown>        
      </ChatHeader>
      <div className="chat-body" id="chat-body">
        {isAlready && isFetchingMsg ?
          dataProvider._data.length > 0 &&
          <>
            <RecyclerListView
              style={{
                width: scrollWidth,
                height: scrollHeight,
              }}
              // useWindowScroll={false}
              ref={messagesListRef}
              dataProvider={dataProvider}
              layoutProvider={layoutProvider}
              rowRenderer={_renderMessage}
              extendedState={extendedState}
              forceNonDeterministicRendering={true}
              onScroll={(elem, x, y) => {
                lazyLoadMessages(elem, y)
              }}
              onViewContainerSizeChange={(dim, index)=>{console.log('OnRecreateParams',dim)}}
            />
            {selectedMessageId&&openDropdownMenu&&
              <div className="chat-drop-down" style={{position:"absolute",top:top+'px',right:'5px'}}>
                <a className={"dropdown-item"} onClick={openEdit}>Edit</a>
                <a className={"dropdown-item"} onClick={handleDelete}>Remove</a>
              </div>
            }
            {actionLoading&&
              <div className="chat-action" style={{position:"absolute",top:top+'px',right:'5px'}}>
                <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
              </div>
            }
          </> 
            :           
          <div className="dialog-loader vh-centered">
            <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
          </div>

        }
      </div>
      <ChatInput sendMessageCallback={sendMessageCallback} />
    </div>
  </ConnectyCubeWrapper>  
  )
}
export default Channel;