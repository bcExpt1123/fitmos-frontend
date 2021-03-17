import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setItemValue,
  addNewDialog,
  updateDialog,
  sortDialogs,
} from "./actions";

const initialState = {
  dialogs:[],//notification
  selectedDialog:null,
  groupName:"",
  route:'list',
  showPanel:false,
};
const reducer = persistReducer(
  {
    storage,
    key: "dialogs",
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
      [addNewDialog]:(state,{payload})=>({
        ...state,
        dialogs:[payload,...state.dialogs]
      }),
      [updateDialog]:(state,{payload})=>{
        const alreadyUpdatedDialog = state.dialogs.map(elem => {
          if (elem._id === payload._id) {
            return Object.assign(elem, payload)
          } return elem
        })
        return {...state, dialogs:alreadyUpdatedDialog}              
      },
      [sortDialogs]:(state,{payload:{message, count}})=>{
        console.log(message, count)
        const updateDialog = state.dialogs.map(elem => {
          if (elem._id === message.dialog_id) {
            const newObj = {
              last_message: message.body,
              last_message_date_sent: message.date_sent,
              updated_date: message.date_sent,
              unread_messages_count: count ? elem.unread_messages_count += 1 : elem.unread_messages_count
            }
            return Object.assign(elem, newObj)
          } return elem
        })
      
        const sort = (items, inverted = false) => items.sort((itemA, itemB) => {
          const result = new Date(itemB.last_message_date_sent * 1000) - new Date(itemA.last_message_date_sent * 1000)
          return inverted ? !result : result
        })
      
      
        const result = sort(updateDialog)
      
        return {...state, dialogs:result}              
      },
    },
    initialState
  )
);
export default reducer;
