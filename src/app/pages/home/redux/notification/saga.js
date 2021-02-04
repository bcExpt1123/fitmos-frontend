import { call, takeLeading,takeLatest, put, select } from "redux-saga/effects";
import {
  setItemValue,
  searchNotifications,
  findFollows,
  follow,
  unfollow,
  accept,
  reject,
  block,
  unblock,
  mute,
  unmute
} from "./actions";
import {
  setItemValue as setPeopleValue,
} from "../people/actions";
import {
  refreshPosts
} from "../post/actions";

import { http } from "../../services/api";
import { ca } from "date-fns/locale";

const searchNotificationsRequest = ()=>
  http({
    path: "search/notifications",
    method: "GET"
  }).then(response => response.data);
function* onSearchNotifications({payload}){
  const notificationLastId = yield select(({notifications})=>notifications.notificationLastId);
  if(payload == notificationLastId) return;
  try {
    const result = yield call(searchNotificationsRequest);
    yield put(setItemValue({name:'notifications',value:result.notifications}));
    const ids = result.notifications.map(item=>item.id);
    if(ids.length){
      const maxId = Math.max(...ids);
      yield put(setItemValue({name:'notificationLastId',value:maxId}));
    }else{
      yield put(setItemValue({name:'notificationLastId',value:0}));
    }
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const findFollowsRequest = (id)=>
  http({
    path: "follows",
    method: "GET"
  }).then(response => response.data);
function* onFindFollows({payload}){
  const followLastId = yield select(({notification})=>notification.followLastId);
  if( payload && payload == followLastId) return;
  try {
    const result = yield call(findFollowsRequest);
    yield put(setItemValue({name:'follows',value:result.requests}));
    const ids = result.requests.map(item=>item.id);
    if(ids.length){
      const maxId = Math.max(...ids);
      yield put(setItemValue({name:'followLastId',value:maxId}));
    }else{
      yield put(setItemValue({name:'followLastId',value:-1}));
    }
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const followRequest = (customerId)=>
  http({
    path: "follows",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);
function* onFollow({payload}){
  console.log(payload)
  yield put(setItemValue({name:'followDisabled',value:true}));
  try{
    const result = yield call(followRequest, payload);
    yield put(setItemValue({name:'followDisabled',value:false}));
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
  }catch(error){
    yield put(setItemValue({name:'followDisabled',value:false}));
  }
}
const unFollowRequest = (customerId)=>
  http({
    path: "follows/unfollow",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);
function* onUnollow({payload}){
  yield put(setItemValue({name:'followDisabled',value:true}));
  try{
    const result = yield call(unFollowRequest, payload);
    yield put(setItemValue({name:'followDisabled',value:false}));
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
  }catch(error){
    yield put(setItemValue({name:'followDisabled',value:false}));
  }  
}
const acceptRequest = (id)=>
  http({
    path: "follows/"+id+"/accept",
    method: "POST"
  }).then(response => response.data);
function* onAccept({payload}){
  try{
    const follows = yield select(({notification})=>notification.follows);
    const filteredFollows = follows.filter(item=>item.id!==payload);
    yield put(setItemValue({name:'follows',value:[...filteredFollows]}));
    const result = yield call(acceptRequest, payload);
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
  }catch(error){

  }
}
const rejectRequest = (id)=>
  http({
    path: "follows/"+id+"/reject",
    method: "POST"
  }).then(response => response.data);
function* onReject({payload}){
  try{
    const follows = yield select(({notification})=>notification.follows);
    const filteredFollows = follows.filter(item=>item.id!==payload);
    yield put(setItemValue({name:'follows',value:[...filteredFollows]}));
    const result = yield call(rejectRequest, payload);
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
  }catch(error){
    
  }
}
const blockRequest = (customerId)=>
  http({
    path: "follows/block",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);
function* onBlock({payload}){
  yield put(setItemValue({name:'blockDisabled',value:true}));
  try{
    const result = yield call(blockRequest, payload);
    yield put(setItemValue({name:'blockDisabled',value:false}));
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
  }catch(error){
    yield put(setItemValue({name:'blockDisabled',value:false}));
  }  
}
const unblockRequest = (customerId)=>
  http({
    path: "follows/unblock",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);

function* onUnblock({payload}){
  yield put(setItemValue({name:'blockDisabled',value:true}));
  try{
    const result = yield call(unblockRequest, payload);
    yield put(setItemValue({name:'blockDisabled',value:false}));
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
  }catch(error){
    yield put(setItemValue({name:'blockDisabled',value:false}));
  }  
}
const muteRequest = (customerId)=>
  http({
    path: "follows/mute",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);

function* onMute({payload}){
  yield put(setItemValue({name:'muteDisabled',value:true}));
  try{
    const result = yield call(muteRequest, payload);
    yield put(setItemValue({name:'muteDisabled',value:false}));
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
  }catch(error){
    yield put(setItemValue({name:'muteDisabled',value:false}));
  }  
}
const unmuteRequest = (customerId)=>
  http({
    path: "follows/unmute",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);

function* onUnmute({payload}){
  yield put(setItemValue({name:'muteDisabled',value:true}));
  try{
    const result = yield call(unmuteRequest, payload);
    yield put(setItemValue({name:'muteDisabled',value:false}));
    if(result.customer)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
  }catch(error){
    yield put(setItemValue({name:'muteDisabled',value:false}));
  }    
}
export default function* rootSaga() {
  yield takeLeading(searchNotifications,onSearchNotifications);
  yield takeLeading(findFollows,onFindFollows);
  yield takeLeading(follow,onFollow);
  yield takeLeading(unfollow,onUnollow);
  yield takeLeading(accept,onAccept);
  yield takeLeading(reject,onReject);
  yield takeLeading(block,onBlock);
  yield takeLeading(unblock,onUnblock);
  yield takeLeading(mute,onMute);
  yield takeLeading(unmute,onUnmute);
}