/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RecyclerListView, DataProvider } from "recyclerlistview/web";
import ConnectyCube from 'connectycube';
import { fetchDialogs, setItemValue } from "../../redux/dialogs/actions"; 
import Avatar from "../../components/Avatar";
import ChatHeader from "./ChatHeader";
import ChatInput from './components/ChatInput';
import Message from './components/Message';
import ChatService from '../../services/chat-service';
import {lastDate} from "../../../../../lib/common";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import { ChatLayoutUtil } from './helper/utils';

const Channel = ()=> {
  const service = ConnectyCube.service;
  let token;
  if(service && service.sdkInstance.session){
    token = service.sdkInstance.session.token;
  }
  useEffect(()=>{
    if(token)ChatService.setUpListeners();
  },[token]);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);
  const clickDialog = ()=>{

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
  const users = [];
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const [dataProvider, setDataProvider] = useState(()=>new DataProvider((r1, r2) => {
    return r1 !== r2 || r1.send_state !== r2.send_state
  }));
  const messagesListRef = useRef();
  const dispatch = useDispatch();
  const lazyLoadMessages = (elem, y) => {
    setRecyclerY(y);
    setContentHeight(elem.nativeEvent.contentSize.height);
    if (listenerLazyLoad && needToGetMoreMessage && y < 2000) {
      setListenerLazyLoad(false);
      ChatService.getMoreMessages(selectedDialog)
        .then(amountMessages => {
          amountMessages === 100 ? setNeedToGetMoreMessage(true) : setNeedToGetMoreMessage(false);
          setListenerLazyLoad(true);
        })
    }
  }
  const handleResize = () => {
    setScrollWidth(document.getElementById('chat-body').clientWidth);
    setScrollHeight(document.getElementById('chat-body').clientHeight);
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
    }
  }
  const scrollToBottom = () => {
    if (messagesListRef && messagesListRef.current && false) {
      messagesListRef.current.scrollToIndex(dataProvider._data.length - 1, false)
    }
  }
  const _renderMessage = (type, item) => {
    // 1 - current sender & 2 - other sender
    const whoIsSender = currentUser.chat_id === item.sender_id ? 1 : 2
    let notRenderAvatar = null

    if (type > 0 && whoIsSender !== 1 &&
      +dataProvider._data[type - 1].sender_id !== +item.sender_id) {
      notRenderAvatar = true
    }

    return (
      <Message
        whoIsSender={whoIsSender}
        message={item}
        notRenderAvatar={notRenderAvatar}
        widthScroll={scrollWidth}
      />
    )
  }
  const [amountMessages, setAmountMessages] = useState(false);
  const setDataProviders = (dialog, count)=>{
    if(dialog && messages[dialog._id]){
      count === 100 ? setNeedToGetMoreMessage(true) : setNeedToGetMoreMessage(false);
      setIsFetchingMsg(true);
      setLayoutProvider(ChatLayoutUtil.getChatLayoutProvider({
        width: scrollWidth,
        dialogId: dialog._id,
        currentUserId: currentUser.chat_id
      }));
      const provider = dataProvider.cloneWithRows(messages[dialog._id]);
      setDataProvider(provider);
      scrollToBottom();
      setListenerLazyLoad(false);
    }else{
      setAmountMessages(count);
    }
  }
  useEffect(()=>{
    if(amountMessages){
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
    if(chatBody.children.length>0 && chatBody.children[0].children.length && chatBody.children[0].children[0].children.length>0){
      const getElement = document.getElementById('chat-body').children[0].children[0].children[0].style.height;
      const fullScrollHeight = getElement.slice(0, getElement.length - 2)
      const newOffset = recyclerY + (fullScrollHeight - contentHeight)
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
  const sendMessageCallback = async (messageText, img) => {
    const dialog = selectedDialog;
    console.log(img);
    if (messageText.length <= 0 && !img) return
    await ChatService.sendMessage(dialog, messageText, img, scrollToBottom)
  }
  useEffect(()=>{
    window.addEventListener('resize', handleResize);
    setScrollWidth(document.getElementById('chat-body').clientWidth);
    setScrollHeight(document.getElementById('chat-body').clientHeight);
    getDialogInfo();
    setIsAlready(true);
    return ()=>{
      window.removeEventListener('resize', handleResize)
    }
  },[]);
  useEffect(()=>{
    if ( messages && messages[selectedDialog._id] && messages[selectedDialog._id].length>0 && layoutProvider) {
      const provider = dataProvider.cloneWithRows(messages[selectedDialog._id]);
      setDataProvider(provider);
    }    
    console.log(messages);
  },[messages]);
  useEffect(()=>{
    updateScrollPosition();
  },[dataProvider]);
  return (
    <div className="chat-container" >
      <ChatHeader title="Chat"/>
      <div className="chat-body" id="chat-body">
        {isAlready && isFetchingMsg ?
          dataProvider._data.length > 0 &&
          <>
            <RecyclerListView
              style={{
                width: scrollWidth,
                height: scrollHeight,
              }}
              useWindowScroll={false}
              ref={messagesListRef}
              dataProvider={dataProvider}
              layoutProvider={layoutProvider}
              rowRenderer={_renderMessage}
              onScroll={(elem, x, y) => {
                lazyLoadMessages(elem, y)
              }}
            />
          </> 
            :           
          <div className="loading-container vh-centered">
            <img src={toAbsoluteUrl("/media/loading/transparent-loading.gif")} alt="loading..." />
          </div>

        }
      </div>
      <ChatInput sendMessageCallback={sendMessageCallback} />
    </div>
  )
}
export default Channel;