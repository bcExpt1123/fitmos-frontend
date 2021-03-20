import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setItemValue,
  pushMessage,
  fetchMessages,
  lazyFetchMessages,
  updateMessages,
  deleteAllMessages,  
  deletedMessage,
  updatedMessageBody,
} from "./actions";

const initialState = {
};
const reducer = persistReducer(
  {
    storage,
    key: "messages",
    blacklist:[],
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setItemValue]:(state, {payload:{name,value}})=>({
        ...state,
        [name]:value
      }),
      [fetchMessages]:(state, {payload:{dialogId,history}})=>{
        const reverted = history;
        return { ...state, [dialogId]: reverted.reverse() }
      },
      [pushMessage]:(state, {payload:{dialogId,message}})=>({
        ...state,
        [dialogId]: [...state[dialogId] || [], message]
      }),
      [lazyFetchMessages]:(state, {payload:{dialogId,history}})=>{
        
        const newArr = history.reverse().concat(state[dialogId])
        return {
            ...state,
            [dialogId]: newArr
          }          
      },
      [updateMessages]:(state, {payload:{dialogId,msgId, msg}})=>{
        if (Object.keys(state).length === 0) {
          return state
        }
      
        const newMessages = state[dialogId].map((elem, index) => {
          if (elem.id === msgId) {
            const updateSendStatus = { ...elem }
            updateSendStatus.send_state = msg.send_state
            return { ...updateSendStatus }
          }
          return elem
        })
      
        return {
          ...state,
          [dialogId]: newMessages
        }          
      },
      [deleteAllMessages]:(state, {payload:{dialogId}})=>({
        ...state,
        [dialogId]: []
      }),
      [deletedMessage]:(state, {payload:{dialogId,messageId}})=>{
        let messages = state[dialogId];
        if(messages){
          messages = messages.filter(message=>message.id!=messageId);
          return {...state,
            [dialogId]: messages
            }
        }
        return state;
      },
      [updatedMessageBody]:(state, {payload:{dialogId,msgId, text}})=>{
        if (Object.keys(state).length === 0) {
          return state
        }
      
        const updateMessages = state[dialogId].map((elem, index) => {
          if (elem.id === msgId) {
            const msg = { ...elem }
            msg.body = text
            return { ...msg }
          }
          return elem
        })
      
        return {
          ...state,
          [dialogId]: updateMessages
        }          
      },
    },
    initialState
  )
);
export default reducer;
