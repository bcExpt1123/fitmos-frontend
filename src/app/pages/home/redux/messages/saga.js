import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  deleteMessage,
  deletedMessage,
  updateMessageBody,
  updatedMessageBody,
  sharePost,
  shareEvento,
} from "./actions";
import {
  setItemValue,
  openPrivateDialog,
  selectedDialog,
} from "../dialogs/actions";
import {
  setItemValue as setPostItemValue,
} from "../post/actions";
import ChatService from '../../services/chat-service';
import { http } from "../../services/api";

function* onDeleteMessage(){
  const selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  const messageId = yield select(({dialog})=>dialog.selectedMessageId);
  try{
    yield put(setItemValue({name:'actionLoading', value:true}));
    yield call(ChatService.deleteMessage, messageId);
    yield put(deletedMessage({dialogId:selectedDialog._id, messageId:messageId}));
    yield put(setItemValue({name:'selectedMessageId', value:null}));
    yield put(setItemValue({name:'openDropdownMenu', value:false}));
    yield put(setItemValue({name:'actionLoading', value:false}));
  }catch(e){
    console.log(e)
    yield put(setItemValue({name:'actionLoading', value:false}));
  } 
}
function* onUpdateMessageBody({payload}){
  const selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  const messageId = yield select(({dialog})=>dialog.selectedMessageId);
  yield put(setItemValue({name:'actionLoading', value:true}));
  try{
    yield call(ChatService.updateMessage, selectedDialog._id, messageId, payload);
    yield put(setItemValue({name:'selectedMessageId', value:null}));
    yield put(setItemValue({name:'openDropdownMenu', value:false}));
    yield put(setItemValue({name:'actionLoading', value:false}));
    yield put(setItemValue({name:'editMessageState', value:false}));
    yield put(updatedMessageBody({dialogId:selectedDialog._id,msgId:messageId, text:payload}))
  }
  catch(e){
    yield put(setItemValue({name:'actionLoading', value:false}));
  }
}
function* onSharePost({payload}){
  yield put(setPostItemValue({name:'sharingPostStart',value:true}));
  yield put(openPrivateDialog(payload.customer));
  let selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  while(selectedDialog == null){
    selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
    yield delay(100);
  }
  try{
    if(selectedDialog)yield call(ChatService.sendMessage, selectedDialog, window.location.origin+"/posts/"+payload.postId);
    yield put(setItemValue({name:'route', value:'channel'}));
  }catch(e){
    console.log(e);
  }
  yield put(setPostItemValue({name:'sharingPostStart',value:false}));
}
function* onShareEvento({payload}){
  yield put(openPrivateDialog(payload.customer));
  let selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
  while(selectedDialog == null){
    selectedDialog = yield select(({dialog})=>dialog.selectedDialog);
    yield delay(100);
  }
  try{
    if(selectedDialog)yield call(ChatService.sendMessage, selectedDialog, window.location.origin+"/eventos/"+payload.id);
    yield put(setItemValue({name:'route', value:'channel'}));
  }catch(e){
    console.log(e);
  }
}
export default function* rootSaga() {
  yield takeLeading(deleteMessage, onDeleteMessage);  
  yield takeLeading(updateMessageBody, onUpdateMessageBody);  
  yield takeLeading(sharePost,onSharePost);
  yield takeLeading(shareEvento,onShareEvento);
}