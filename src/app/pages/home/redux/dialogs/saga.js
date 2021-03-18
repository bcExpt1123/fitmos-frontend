import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  setItemValue,
  createDialog,
  fetchDialogs,
  updateDialog,
  sortDialogs,
  selectedDialog,  
  updateGroupName, 
  leaveGroupDialog,
  deleteGroupDialog,
  deleteDialog,
  DIALOG_TYPE,
} from "./actions";
import ChatService from '../../services/chat-service';
import AuthService from '../../services/chat-auth';
import { http } from "../../services/api";

function* onCreateDialog({payload}){
  let dialogs = yield select(({dialog})=>dialog.dialogs);
  let dialog = dialogs.find(elem => {
    return (elem.type === DIALOG_TYPE.PRIVATE && elem.occupants_ids.find(elem => elem === payload))
  })
  if (!dialog) {
    const params = {
      type: DIALOG_TYPE.PRIVATE,
      occupants_ids: payload,
    }

    const response = yield call(ChatService.createPrivateDialog, params);
    dialog = {...response};
    const customers = yield select(({people})=>people.people);
    dialog.users = dialog.occupants_ids.map(chat_id=>{
      const user = customers.find(customer=>chat_id==customer.chat_id);
      return user;
    }).filter(customer=> {if(customer && customer.id)return customer});
    dialogs = [dialog, ...dialogs];
    yield put(setItemValue({name:'dialogs',value:dialogs}))
  }
  yield put(setItemValue({name:'selectedDialog',value:dialog}))
}
function* onFetchDialogs({payload}){
  let dialogs = yield select(({dialog})=>dialog.dialogs);
  console.log("fetch dialogs")
  if (dialogs.length === 0 || payload === true ) {
    const result = yield call(ChatService.fetchDialogsFromServer);
    const items = result.items;
    const customers = yield select(({people})=>people.people);
    const currentUser = yield select(({auth})=>auth.currentUser);
    if(currentUser){
      const dialogs = items.map(dialog=>{
        dialog.users = dialog.occupants_ids.map(chat_id=>{
          const user = customers.find(customer=>chat_id==customer.chat_id);
          return user;
        }).filter(customer=> {if(customer && customer.id && currentUser.customer.id!=customer.id)return customer});
        dialog.owner = dialog.users.find(customer=> {return(customer && customer.id && dialog.user_id!=customer.id)});
        return dialog;
      });
      yield put(setItemValue({name:'dialogs',value:dialogs}));
    }else{
      yield put(setItemValue({name:'dialogs',value:[]}));
    }
  }
}
function* onUpdateGroupName(){
  const selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  const groupName = yield select(({dialog})=>dialog.groupName);
  if(groupName.length<3){
    alert("Please add 3 more chars");
    yield put(setItemValue({name:'groupName',value:selectedDialog.name}))
    return;
  }
  try{
    const result = yield call(ChatService.updateDialogName, selectedDialog._id, groupName);
    yield put(updateDialog(result));
  }catch(e){
    console.log(e)
  } 
}
function* onLeaveGroupDialog({payload}){
  const selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  try{
    const result = yield call(ChatService.leaveUserDialogs, selectedDialog._id, [payload.chat_id]);
    const currentUser = yield select(({auth})=>auth.currentUser);
    let dialog = {...result};
    dialog.users = dialog.occupants_ids.filter(id=>currentUser.chat_id!=id).map(chat_id=>{
      const user = selectedDialog.users.find(customer=>chat_id==customer.chat_id);
      return user;
    });
    dialog.owner = dialog.users.find(customer=> {return(customer && customer.id && dialog.user_id!=customer.id)});
    yield put(setItemValue({name:'selectedDialog',value:dialog}));
    yield put(updateDialog(result));
  }catch(e){
    console.log(e)
  } 
}
function* onDeleteGroupDialog(){
  const selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  try{
    yield call(ChatService.deleteGroupDialog, selectedDialog._id);
    yield put(deleteDialog(selectedDialog._id));
  }catch(e){
    console.log(e)
  } 
}
export default function* rootSaga() {
  yield takeLeading(createDialog,onCreateDialog);
  yield takeLeading(fetchDialogs,onFetchDialogs);
  yield takeLeading(updateGroupName, onUpdateGroupName);
  yield takeLeading(leaveGroupDialog, onLeaveGroupDialog);
  yield takeLeading(deleteGroupDialog, onDeleteGroupDialog);
}
