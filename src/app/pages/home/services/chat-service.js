import ConnectyCube from 'connectycube';
import {
  fetchDialogs,
  sortDialogs,
  updateDialog,
  addNewDialog,
  selectedDialog,
  DIALOG_TYPE
} from '../redux/dialogs/actions';
import {
  pushMessage,
  fetchMessages,
  lazyFetchMessages,
  updateMessages,
  STATUS_DELIVERED,
  STATUS_READ,
  STATUS_SENT,
  GROUP_CHAT_ALERT_TYPE
} from '../redux/messages/actions';
import { preparationAttachment } from '../social/chat/helper/utils';
import AuthService from './chat-auth';
import store from '../../../store/store';
import { Message, FakeMessage } from '../social/chat/models/Message';

class ChatService {

  setUpListeners() {
    if(ConnectyCube.chat){
      console.log("ConnectyCube.chat")
      ConnectyCube.chat.onMessageListener = chatService.onMessageListener.bind(this)
      ConnectyCube.chat.onSentMessageCallback = chatService.onSentMessageListener.bind(this)
      ConnectyCube.chat.onDeliveredStatusListener = chatService.onDeliveredStatus.bind(this)
      ConnectyCube.chat.onReadStatusListener = chatService.onReadStatus.bind(this)
    }
  }
  async autologin (){
    const auth = store.getState().auth;
    const dataUser = { login:auth.currentUser.id, password:auth.accessToken }
    await AuthService.init();
    await AuthService.signIn(dataUser, auth.currentUser);
  }
  async fetchDialogsFromServer() {
    let dialogsFromServer;
    try{
      dialogsFromServer = await ConnectyCube.chat.dialog.list();
    }catch(e){
      await chatService.autologin();
      dialogsFromServer = await ConnectyCube.chat.dialog.list();
    }
    return dialogsFromServer;
  }

  async getMessages(dialog) {
    const isAlredyUpdate = chatService.getMessagesByDialogId(dialog._id)
    let amountMessages = null

    // If the first entry into the chat
    if (!dialog.isAlreadyMessageFetch || dialog.unread_messages_count > 0 && !dialog.isAlreadyMessageFetch) {
      let historyFromServer;
      try{
        historyFromServer = await ConnectyCube.chat.message.list({
          chat_dialog_id: dialog._id,
          sort_desc: 'date_sent'
        })
      }catch(e){
        await chatService.autologin();
        historyFromServer = await ConnectyCube.chat.message.list({
          chat_dialog_id: dialog._id,
          sort_desc: 'date_sent'
        })
      }

      const messages = []
      historyFromServer.items.forEach(elem => {
        if (!elem.group_chat_alert_type) {
          const auth = store.getState().auth;
          messages.push(new Message(elem, auth.currentUser.chat_id))
        }
      })

      const newObj = Object.assign(dialog, { isAlreadyMessageFetch: true })
      chatService.updateDialogsUnreadMessagesCount(newObj)
      store.dispatch(fetchMessages({dialogId:dialog._id,history:messages}));
      amountMessages = messages.length
    } else {
      // If the second entry into the chat
      if (dialog.unread_messages_count > 0) {
        const messages = chatService.getMessagesByDialogId(dialog._id)
        const firstUnreadMsg = messages[dialog.unread_messages_count - 1]
        chatService.readAllMessages(dialog._id)
        await chatService.sendReadStatus(firstUnreadMsg.id, firstUnreadMsg.sender_id, firstUnreadMsg.dialog_id)
        chatService.updateDialogsUnreadMessagesCount(dialog)
      }
      amountMessages = isAlredyUpdate.length
    }
    return amountMessages
  }

  // Message loading if more than 100
  getMoreMessages = async (dialog) => {
    const currentMessages = chatService.getMessagesByDialogId(dialog._id)
    const lastMessageDate = currentMessages[0]
    const updateObj = Object.assign(dialog, { last_messages_for_fetch: lastMessageDate.date_sent })

    const filter = {
      chat_dialog_id: dialog._id,
      date_sent: { lt: lastMessageDate.date_sent },
      sort_desc: 'date_sent'
    }

    const moreHistoryFromServer = await ConnectyCube.chat.message.list(filter)

    const messages = []
    moreHistoryFromServer.items.forEach(elem => {
      if (!elem.group_chat_alert_type) {
        const auth = store.getState().auth;
        messages.push(new Message(elem, auth.currentUser.chat_id))
      }
    })

    store.dispatch(updateDialog(updateObj))
    const amountMessages = store.dispatch(lazyFetchMessages({dialogId:dialog._id,history:messages}))
    return amountMessages.history.length
  }


  async sendMessage(dialog, messageText, attachments = false, scrollToBottom) {
    const auth = store.getState().auth;
    const user = auth.currentUser;
    const text = messageText.trim()
    const date = Math.floor(Date.now() / 1000)
    const recipient_id = dialog.type === DIALOG_TYPE.PRIVATE ? dialog.occupants_ids.find(elem => elem != user.chat_id)
      : dialog.xmpp_room_jid

    let msg = {
      type: dialog.type === 3 ? 'chat' : dialog.type ? 'groupchat' : '',
      body: text,
      extension: {
        save_to_history: 1,
        dialog_id: dialog._id,
        sender_id: user.chat_id,
        date_sent: date,
      },
      // markable: 1
    }

    msg.id = chatService.messageUniqueId
console.log(msg, dialog);
    // If send message as Attachment
    if (attachments) {
      return chatService.sendMessageAsAttachment(dialog, recipient_id, msg, attachments, scrollToBottom)
    }

    const message = new FakeMessage(msg)

    const newObjFreez = Object.freeze(message)

    await store.dispatch(pushMessage({dialogId:dialog._id,message:newObjFreez} ))
    scrollToBottom()
    ConnectyCube.chat.send(recipient_id, msg)
    store.dispatch(sortDialogs({message:newObjFreez}))
  }


  sendMsgChatAlertOnCreate = async (dialog, message, alertType) => {
    const date = Math.floor(Date.now() / 1000)
    const auth = store.getState().auth;
    const recipient_id = dialog.type === DIALOG_TYPE.PRIVATE ? dialog.occupants_ids.find(elem => elem != auth.currentUser.chat_id)
      : dialog.xmpp_room_jid
    const messageExtensions = {
      date_sent: date,
      save_to_history: 1,
      dialog_id: dialog._id,
      group_chat_alert_type: alertType,
      sender_id: auth.currentUser.chat_id,
    }
    const msg = {
      type: !dialog.xmpp_room_jid ? 'chat' : 'groupchat',
      body: message,
      extension: messageExtensions,
    }
    ConnectyCube.chat.send(recipient_id, msg)
  }

  sendChatAlertOnCreate(dialog) {
    const message = 'Group is created'
    chatService.sendMsgChatAlertOnCreate(dialog, message, GROUP_CHAT_ALERT_TYPE.CREATE)
  }

  async sendMessageAsAttachment(dialog, recipient_id, msg, attachments, scrollToBottom) {
    //create fake data for render img
    const url = URL.createObjectURL(attachments.file)
    msg.extension.attachments = [{ url }]
    msg.body = 'Image attachment'
    const message = new FakeMessage(msg)
    await store.dispatch(pushMessage({dialogId:dialog._id,message} ))
    scrollToBottom()

    // create real data for attachment
    const response = await chatService.uploadPhoto(attachments)
    // const newObjAttach = preparationAttachment(response)
    // msg.extension.attachments = [newObjAttach]
    await ConnectyCube.chat.send(recipient_id, msg)
    store.dispatch(sortDialogs({message}))
    return
  }

  async createPrivateDialog(params) {
    const response = await ConnectyCube.chat.dialog.create(params)
    return response
  }


  updateDialogsUnreadMessagesCount = (dialog) => {
    const updateObj = Object.assign(dialog, { unread_messages_count: 0 })
    store.dispatch(updateDialog(updateObj))
    return true
  }

  async createPublicDialog(occupants_ids, groupName, img) {
    const auth = store.getState().auth;
    const currentUser = auth.currentUser
    occupants_ids.unshift(currentUser.chat_id)
    const params = {
      type: DIALOG_TYPE.GROUP,
      occupants_ids,
      name: groupName,
    }
    const image = img ? await this.uploadPhoto(img) : null
    if (image) {
      params.photo = image.uid
    }
    const service = ConnectyCube.service;
    let token;
    if(service && service.sdkInstance.session){
      token = service.sdkInstance.session.token;
    }else{
      await chatService.autologin();
    }
    console.log(token)
    let dialog;
    try{
      dialog = await ConnectyCube.chat.dialog.create(params)
      store.dispatch(addNewDialog(dialog));
    }catch(e){
      console.log(e) 
    }
    
    return dialog;
  }

  async readAllMessages(dialogId) {
    return ConnectyCube.chat.message.update(null, {
      chat_dialog_id: dialogId,
      read: 1
    })
  }

  async readMessage(messageId, dialogId) {
    chatService.onReadStatus(messageId, dialogId)
    return ConnectyCube.chat.message.update(null, {
      chat_dialog_id: dialogId,
      read: 1
    })
  }

  async onMessageListener(senderId, msg) {
    console.log(msg)
    const message = new Message(msg)
    const auth = store.getState().auth;
    const user = auth.currentUser;
    const selectedDialog = store.getState().dialog.selectedDialog;
    const dialog = selectedDialog?._id
    // If group chat alet
    if (msg.extension.group_chat_alert_type) {
      const dialogsFromServer = await ConnectyCube.chat.dialog.list()
      const dialogs = dialogsFromServer.items.map(elem => {
        return [...elem];
      })
      store.dispatch(fetchDialogs(dialogs))
      return
    }
    console.log(senderId, user.chat_id,senderId !== user.chat_id)
    if (senderId !== user.chat_id) {
      if (dialog === message.dialog_id) {
        store.dispatch(sortDialogs({message}))
        chatService.readMessage(message.id, message.dialog_id)
        chatService.sendReadStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
      } else {
        chatService.sendDeliveredStatus(msg.extension.message_id, msg.extension.sender_id, msg.dialog_id)
        store.dispatch(sortDialogs({message,count:true}))
      }
      store.dispatch(pushMessage({dialogId:message.dialog_id,message} ))
    }
  }

  // ConnectyCube listeners
  onSentMessageListener(failedMessage, msg) {
    console.warn('onSentMessageListener')
    if (failedMessage || msg.extension.group_chat_alert_type) {
      return
    } 
    store.dispatch(updateMessages({dialogId:msg.extension.dialog_id, msgId:msg.id, msg:{ send_state: STATUS_SENT }}))
  }

  onDeliveredStatus(messageId, dialogId, userId) {
    console.warn('onDeliveredStatus', messageId)
    store.dispatch(updateMessages({dialogId, msgId:messageId, msg:{ send_state: STATUS_DELIVERED }}))
  }

  onReadStatus(messageId, dialogId, userId) {
    console.warn('onReadStatus', messageId)
    store.dispatch(updateMessages({dialogId, msgId:messageId, msg:{ send_state: STATUS_READ }}))
  }



  sendReadStatus(messageId, userId, dialogId) {
    ConnectyCube.chat.sendReadStatus({ messageId, userId, dialogId })
  }

  sendDeliveredStatus(messageId, userId, dialogId) {
    ConnectyCube.chat.sendDeliveredStatus({ messageId, userId, dialogId })
  }

  getDialogById(dialogId) {
    // return store.getState().dialogs.find(elem => elem.id === dialogId)
  }

  getMessagesByDialogId(dialogId) {
    const result = store.getState().message;
    return result[dialogId]
  }

  async uploadPhoto(file) {
    return ConnectyCube.storage.createAndUpload(file)
  }

  get currentUser() {
    // return store.getState().currentUser.user
  }

  getUserFromReduxById(id) {
    // return store.getState().users[id]
  }

  get messageUniqueId() {
    return ConnectyCube.chat.helpers.getBsonObjectId()
  }
}


const chatService = new ChatService()

Object.freeze(chatService)

export default chatService