import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Mention, MentionsInput } from "react-mentions";
import classnames from "classnames";
import { NimblePicker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import data from "emoji-mart/data/google.json";
import { isMobile } from '../../../../../../_metronic/utils/utils';
import { colonsToUnicode } from '../../../services/emoji';
import ImageUpload from "./ImageUpload";

export default function({sendMessageCallback}) {
  const [messageText, setMessageText] =  useState('');

  const sendMessage = (e) => {
    e.preventDefault()
    sendMessageCallback(messageText)
      .then(() => (setMessageText('')))
      .catch(() => (setMessageText('')))
  }

  const getImage = (image) => {
    sendMessageCallback(messageText, image)
      .then(() => (setMessageText('')))
      .catch(() => (setMessageText('')))
  }
  const [showEmojis, setShowEmojis] = useState(false);
  const textRef = useRef();
  const emojiPicker = useRef(null);
  const selectedDialog = useSelector(({dialog})=>dialog.selectedDialog);  
  const dialogUsers = selectedDialog.users;  
  let users = dialogUsers.map((user)=>({id:user.id, display:user.display}));
  users = [{id:0,display:'all'},...users];
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const filterPeople=(search, callback)=>{
    if(selectedDialog.type===2){
      if(search.length>1){
        const filteredPeople = users.filter((customer)=> customer.display.toLowerCase().includes(search.toLowerCase()));
        callback(filteredPeople.slice(0, 20));
      }else{
        callback(users.slice(0, 20));
      }
    }
  }
  const handleSelectEmoji = emoji => {
    setShowEmojis(false);
    setMessageText(`${messageText} ${emoji.native}`);
  };
  const handleChange = event => {
    let text = colonsToUnicode(event.target.value);
    setMessageText(text);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPicker.current && !emojiPicker.current.contains(event.target)) {
        setShowEmojis(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPicker]);
  const [blocked, setBlocked] = useState(false)
  useEffect(()=>{
    if(selectedDialog.type===3 && currentUser.customer.blockedChatIds && currentUser.customer.blockedChatIds.length>-1){
      if(currentUser.customer.blockedChatIds && currentUser.customer.blockedChatIds.includes(selectedDialog.users[0].chat_id)){
        console.log('blocked',selectedDialog.users[0].chat_id)
        setBlocked(true);
        if(textRef.current)textRef.current.disabled=true;
      }
      else {
        console.log('unblocked',selectedDialog.users[0].chat_id)
        setBlocked(false);
        if(textRef.current)textRef.current.disabled=false;
      }
    }
  },[currentUser.customer.blockedChatIds]);
  useEffect(()=>{
    if(textRef.current){
      textRef.current.focus();
      textRef.current.setSelectionRange(textRef.current.value.length,textRef.current.value.length);
    }    
  },[]);
  const renderPeopleSuggestion = (entry, search, highlightedDisplay, index, focused)=>{
    return <div className={classnames("mention-customers",{focused:focused})}>
      <div className="info">
        <div>{
          Array.isArray(highlightedDisplay.props.children)?
          <>{
            highlightedDisplay.props.children.map((child, index1)=><span key={index1}>
              {child}
            </span>)
          }
          </>
          :
          <>
            {highlightedDisplay.props.children}
          </>
          }</div>
      </div>
      
    </div>
  }
  const handleEnterPress = event =>{
    if(event.keyCode == 13 ) {
      if(event.shiftKey == false){
        event.preventDefault();
        sendMessage(event);
      }
    }
  }
  const editMessageState = useSelector(({dialog})=>dialog.editMessageState);
  const selectedMessageId = useSelector(({dialog})=>dialog.selectedMessageId);
  const messages = useSelector(({message})=>message);
  useEffect(()=>{
    if(editMessageState){
      if(selectedMessageId && selectedDialog){
        const currentMessages = messages[selectedDialog._id];
        if(currentMessages && currentMessages.length>0){
          const selectedMessage = currentMessages.find((message)=>message.id===selectedMessageId);
          if(selectedMessage){
            setMessageText(selectedMessage.body);
            textRef.current.focus();
          }
        }
      }
    }else{
      setMessageText('');
    }
  },[editMessageState])
  const onUpload = (cropedImage)=>{
    // cropper.getCroppedCanvas().toBlob((blob) => {
    //   const cropedImage = new File([blob], "image.jpg", { type: 'image/jpeg' });
      const image = {
        size: cropedImage.size,
        type: cropedImage.type,
        file: cropedImage,
        width:500,
        height:500,
        name: 'croped_image.jpg',
        public: false
      }
      sendMessageCallback(messageText, image)
      .then(() => (setMessageText('')))
      .catch(() => (setMessageText('')))      
    // });

  }

  return (
    <footer>
      <form onSubmit={sendMessage}>
        <fieldset disabled={blocked || currentUser.customer.muteStatus}>
          <ImageUpload onUpload={onUpload}/>
          <MentionsInput
            value={messageText}
            onChange={handleChange}
            onKeyDown={handleEnterPress}
            inputRef={textRef}
            className="mentions"
            placeholder={(blocked || currentUser.customer.muteStatus) ? "Chat deshabilitado":"Escribe un mensaje..."}
            allowSuggestionsAboveCursor={true}
          >
            <Mention data={filterPeople} renderSuggestion={renderPeopleSuggestion} displayTransform = {(id, display)=>{return '@' + display}}/>
          </MentionsInput>
          {isMobile()===false&&<>
            {showEmojis ? (
              <span className={"emoji__picker"}  ref={emojiPicker}>
                <NimblePicker
                  onSelect={handleSelectEmoji}
                  showSkinTones={false}
                  emojiTooltip={false}
                  showPreview={false}
                  sheetSize={32}
                  data={data}
                />
              </span>
            ) : (
              <button
                className={"emoji__button"}
                onClick={() => setShowEmojis(true)}
              >
                {String.fromCodePoint(0x1f60a)}
              </button>
            )}                
          </>}
          <button className="send" onClick={sendMessage} disabled={blocked || !currentUser.customer.muteStatus}>
            <i className="fas fa-paper-plane" />
          </button>
        </fieldset>
      </form>
    </footer>
  )
}
