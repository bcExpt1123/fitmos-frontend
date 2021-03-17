import React, { useState } from 'react'
// import ImagePicker from '../../../../helpers/imagePicker/imagePicker';
// import './chatInput.css'

export default function({sendMessageCallback}) {
  const [messageText, setMessageText] =  useState('');

  const changeMessage = event => (setMessageText(event.target.value))

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

  return (
    <footer>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={messageText}
          onChange={changeMessage}
          placeholder="Write your message..."
          name="search" />
        <div className="chat-attachment">
          {/* <ImagePicker pickAsAttachment getImage={getImage} /> */}
        </div>
        <button onClick={sendMessage}>
          <i className="fas fa-paper-plane" />
        </button>
      </form>
    </footer>
  )
}
