import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  setItemValue,
  createDialog,
  fetchDialogs,
  sortDialogs,
  selectedDialog,  
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
    const dialogs = items.map(dialog=>{
      dialog.users = dialog.occupants_ids.map(chat_id=>{
        const user = customers.find(customer=>chat_id==customer.chat_id);
        return user;
      }).filter(customer=> {if(customer && customer.id && currentUser.customer.id!=customer.id)return customer});
      return dialog;
    });
    yield put(setItemValue({name:'dialogs',value:dialogs}));
  }
}
export default function* rootSaga() {
  yield takeLeading(createDialog,onCreateDialog);
  yield takeLeading(fetchDialogs,onFetchDialogs);
}
