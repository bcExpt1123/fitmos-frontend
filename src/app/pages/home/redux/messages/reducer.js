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
    },
    initialState
  )
);
export default reducer;
