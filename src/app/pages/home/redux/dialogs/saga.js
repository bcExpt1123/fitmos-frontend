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
  addedUsersDialog,
  openPrivateDialog,
  DIALOG_TYPE,
} from "./actions";
import ChatService from '../../services/chat-service';

function* onCreateDialog({payload}){
  let dialogs = yield select(({dialog})=>dialog.dialogs);
  let dialog = dialogs.find(elem => (elem.type === DIALOG_TYPE.PRIVATE && elem.occupants_ids.includes(payload)));
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
function* onFetchDialogs(){
  let dialogs = yield select(({dialog})=>dialog.dialogs);
  const listLoading = yield select(({dialog})=>dialog.listLoading);
  console.log("fetch dialogs")
  if (dialogs.length === 0 || listLoading === true ) {
    yield put(setItemValue({name:'actionLoading', value:true}));
    try{
      const result = yield call(ChatService.fetchDialogsFromServer);
      const items = result.items;
      let customers = yield select(({people})=>people.people);
      const privateProfiles = yield select(({people})=>people.privateProfiles);
      customers = [...customers, ...privateProfiles];
      const currentUser = yield select(({auth})=>auth.currentUser);
      yield put(setItemValue({name:'actionLoading', value:false}));
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
      yield put(setItemValue({name:'listLoading',value:false}));
    }catch(e){
      yield put(setItemValue({name:'actionLoading', value:false}));
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
    const dialog = {...selectedDialog,name:groupName};
    yield put(setItemValue({name:'selectedDialog',value:dialog}));
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
    yield put(setItemValue({name:'selectedDialog',value:null}));
  }catch(e){
    console.log(e)
  } 
}
function* onAddedUsersDialog({payload}){
  const customers = yield select(({people})=>people.people);
  const currentUser = yield select(({auth})=>auth.currentUser);
  payload.users = payload.occupants_ids.map(chat_id=>{
    const user = customers.find(customer=>chat_id==customer.chat_id);
    return user;
  }).filter(customer=> {if(customer && customer.id && currentUser.customer.id!=customer.id)return customer});
  payload.owner = payload.users.find(customer=> {return(customer && customer.id && payload.user_id!=customer.id)});
  yield put(updateDialog(payload));
  yield put(setItemValue({name:'groupName',value:''}));
  const returnPath = yield select(({dialog})=>dialog.backRouteEditDialog);
  if(returnPath!="channel")yield put(setItemValue({name:'selectedDialog',value:null}));
  else{
    yield put(setItemValue({name:'selectedDialog',value:payload}));
  }
  yield put(setItemValue({name:'route',value:returnPath}));
}
function* onOpenPrivateDialog({payload}){//customer
  const chatUserId = payload.chat_id || payload.user&&payload.user.chat_id;
  const showPanel = yield select(({dialog})=>dialog.showPanel);
  let dialogs = yield select(({dialog})=>dialog.dialogs);
  if(showPanel){

  }else{
    yield put(setItemValue({name:'showPanel', value:true}));
    if(dialogs.length === 0 ){
      yield put(setItemValue({name:'actionLoading',value:true}));
      let actionLoading = yield select(({dialog})=>dialog.actionLoading);
      while (actionLoading){
        yield delay(1000);
        actionLoading = yield select(({dialog})=>dialog.actionLoading);
        console.log(actionLoading);
      }
      yield put(setItemValue({name:'actionLoading',value:false}));
    }
  }  
  const findDialog = dialogs.find(dialog=>dialog.type==3 && dialog.occupants_ids.includes(chatUserId));
  if(findDialog){
    const route = yield select(({dialog})=>dialog.route);
    if(route === 'route'){
      const selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
      if(selectedDialog._id!=findDialog._id){
        
      }
    }
    yield put(setItemValue({name:'selectedDialog', value:findDialog}));
    yield put(setItemValue({name:'route',value:'channel'}));
  }else{
    yield put(createDialog(chatUserId));
  }
}
export default function* rootSaga() {
  yield takeLeading(createDialog,onCreateDialog);
  yield takeLeading(fetchDialogs,onFetchDialogs);
  yield takeLeading(updateGroupName, onUpdateGroupName);
  yield takeLeading(leaveGroupDialog, onLeaveGroupDialog);
  yield takeLeading(deleteGroupDialog, onDeleteGroupDialog);
  yield takeLeading(addedUsersDialog, onAddedUsersDialog);
  yield takeLeading(openPrivateDialog, onOpenPrivateDialog);
}
