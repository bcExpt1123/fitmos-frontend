import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setItemValue,
  addNewDialog,
  updateDialog,
  editGroupDialog,
  sortDialogs,
  deleteDialog,
  createdDialog,
  addPostMessageIds
} from "./actions";

const initialState = {
  dialogs:[],//notification
  selectedDialog:null,
  groupName:"",
  editDialog:null,
  route:'list',
  backRouteEditDialog:"",
  backRouteAddUsers:"",
  showPanel:false,
  selectedMessageId:null,
  openDropdownMenu:false,
  editMessageState:false,
  actionLoading:false,
  listLoading:true,// dialog list change
  selectedMessageTop:100,
  postMessageIds:[],
  postMessageCount:0,
  groupImage:null,
};
const reducer = persistReducer(
  {
    storage,
    key: "dialogs",
    blacklist:['selectedMessageId','actionLoading', 'openDropdownMenu','editMessageState','actionLoading', 'listLoading','postMessageIds','groupImage' ],
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
      [editGroupDialog]:(state,{payload})=>({
        ...state,
        route:payload.route,
        backRouteEditDialog:payload.backRouteEditDialog,
        groupName:state.selectedDialog.name,
      }),
      [deleteDialog]:(state,{payload})=>{
        const filteredDialogs = state.dialogs.filter(elem =>elem._id !=payload)
        return {...state, dialogs:filteredDialogs}              
      },
      [createdDialog]:(state,{payload})=>({...state, selectedDialog:payload,route:'channel',groupName:''}),
      [addPostMessageIds]:(state,{payload})=>{
        if(payload){
          let ids = state.postMessageIds;        
          if(!state.postMessageIds.includes(payload))ids = [...ids, payload];
          return {...state,postMessageIds:ids,postMessageCount:state.postMessageCount+1}
        }else{
          return state;
        }
      }
    },
    initialState
  )
);
export default reducer;
