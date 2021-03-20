import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  deleteMessage,
  deletedMessage,
  updateMessageBody,
  updatedMessageBody
} from "./actions";
import {
  setItemValue,
} from "../dialogs/actions";
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
    yield put(updatedMessageBody({dialogId:selectedDialog._id,msgId:messageId, text:payload}))
  }
  catch(e){
    yield put(setItemValue({name:'actionLoading', value:false}));
  }
}
export default function* rootSaga() {
  yield takeLeading(deleteMessage, onDeleteMessage);  
  yield takeLeading(updateMessageBody, onUpdateMessageBody);  
}