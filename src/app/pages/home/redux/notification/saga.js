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
  unmute,
  showFollows,
  appendFollows
} from "./actions";
import {
  setItemValue as setPeopleValue,
} from "../people/actions";
import {
  refreshPosts
} from "../post/actions";
import {
  createDialog
} from "../dialogs/actions";

import { http } from "../../services/api";
import { ca } from "date-fns/locale";
import { LiveTvOutlined, SelectAllOutlined } from "@material-ui/icons";

const searchNotificationsRequest = ()=>
  http({
    path: "search/notifications",
    method: "GET"
  }).then(response => response.data);
function* onSearchNotifications({payload}){
  const notificationLastId = yield select(({notification})=>notification.notificationLastId);
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
function* onFindFollows(){
  // const followLastId = yield select(({notification})=>notification.followLastId);
  // if( payload && payload == followLastId) return;
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
  yield put(setItemValue({name:'followDisabled',value:true}));
  try{
    const result = yield call(followRequest, payload);
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
    let searchResult = yield select(({people})=>people.searchResult);
    let customers = searchResult.people.map(customer=>{
      if(customer.id == result.customer.id){
        customer.following = result.customer.following;
      }
      return customer;
    })
    searchResult.people = customers;
    yield put(setPeopleValue({name:'searchPageResults',value:searchResult}));
    let searchCustomers = yield select(({people})=>people.searchCustomers);
    customers = searchCustomers.map(customer=>{
      if(customer.id == result.customer.id){
        customer.following = result.customer.following;
      }
      return customer;
    })
    yield put(setPeopleValue({name:'searchCustomers',value:customers}));
    if(result.status === 'accepted'){
      if(result.customer.chat_id)yield put(createDialog(result.customer.chat_id));
    }
  }catch(error){
    console.log(error)
  }
  yield put(setItemValue({name:'followDisabled',value:false}));
}
const unFollowRequest = (customerId)=>
  http({
    path: "follows/unfollow",
    method: "POST",
    data:{
      customer_id:customerId
    }
  }).then(response => response.data);
function* onUnfollow({payload}){
  yield put(setItemValue({name:'followDisabled',value:true}));
  try{
    const result = yield call(unFollowRequest, payload);
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
    const currentUser = yield select(({auth})=>auth.currentUser);
    const followCustomerId = yield select(({notification})=>notification.followCustomerId);
    if(followCustomerId!=false){
      if(followCustomerId == currentUser.customer.id ){
        const followings = yield select(({notification})=>notification.followings);
        const filteredFollowings = followings.filter((follow)=>!(follow.follower_id==followCustomerId && follow.customer_id==payload));
        yield put(setItemValue({name:'followings',value:filteredFollowings}));
      }else{
        const followers = yield select(({notification})=>notification.followers);
        const filteredFollowers = followers.filter((follow)=>!(follow.customer_id==followCustomerId && follow.follower_id==payload));
        yield put(setItemValue({name:'followers',value:filteredFollowers}));
      }
    }
    yield put(refreshPosts());
    let searchResult = yield select(({people})=>people.searchResult);
    let customers = searchResult.people.map(customer=>{
      if(customer.id == result.customer.id){
        customer.following = result.customer.following;
      }
      return customer;
    })
    searchResult.people = customers;
    yield put(setPeopleValue({name:'searchPageResults',value:searchResult}));
    let searchCustomers = yield select(({people})=>people.searchCustomers);
    customers = searchCustomers.map(customer=>{
      if(customer.id == result.customer.id){
        customer.following = result.customer.following;
      }
      return customer;
    })
    yield put(setPeopleValue({name:'searchCustomers',value:customers}));
  }catch(error){
    console.log(error)
  }  
  yield put(setItemValue({name:'followDisabled',value:false}));
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
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
    const currentUser = yield select(({auth})=>auth.currentUser);
    const followCustomerId = yield select(({notification})=>notification.followCustomerId);
    if(followCustomerId!=false){
      if(followCustomerId == currentUser.customer.id ){
        const followers = yield select(({notification})=>notification.followers);
        const updatedFollowers = followers.map((follow)=>{
          if(follow.id == payload)follow.status = 'accepted';
          return follow
        });
        yield put(setItemValue({name:'followers',value:updatedFollowers}));
      }else{
        const followings = yield select(({notification})=>notification.followings);
        const updatedFollowings = followings.map((follow)=>{
          if(follow.id == payload)follow.status = 'accepted';
          return follow
        });
        yield put(setItemValue({name:'followings',value:updatedFollowings}));
      }
    }
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
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
    const currentUser = yield select(({auth})=>auth.currentUser);
    const followCustomerId = yield select(({notification})=>notification.followCustomerId);
    if(followCustomerId!=false){
      if(followCustomerId == currentUser.customer.id ){
        const followers = yield select(({notification})=>notification.followers);
        const updatedFollowers = followers.map((follow)=>{
          if(follow.id == payload)follow.status = 'rejected';
          return follow
        });
        yield put(setItemValue({name:'followers',value:updatedFollowers}));
      }else{
        const followings = yield select(({notification})=>notification.followings);
        const updatedFollowings = followings.map((follow)=>{
          if(follow.id == payload)follow.status = 'rejected';
          return follow
        });
        yield put(setItemValue({name:'followings',value:updatedFollowings}));
      }
    }
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
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
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
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
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
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
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
    const username = yield select(({people})=>people.username);
    if(result.customer && username.id == result.customer.id)yield put(setPeopleValue({name:'username',value:result.customer}));
    yield put(refreshPosts());
  }catch(error){
    yield put(setItemValue({name:'muteDisabled',value:false}));
  }    
}
function* onShowFollows({payload}){
  let follows; 
  const customerId = yield select(({notification})=>notification.followCustomerId);
  if(payload.customer.id === customerId){
    if(payload.key === 'followings'){
      follows = yield select(({notification})=>notification.followings);
    }else{
      follows = yield select(({notification})=>notification.followers);
    }
    if(follows.length===0){
      yield put(appendFollows(payload.key));
    }
  }else{
    yield put(setItemValue({name:'followings',value:[]}));
    yield put(setItemValue({name:'followingsLastPageNumber',value:0}));
    yield put(setItemValue({name:'followingsLast',value:false}));
    yield put(setItemValue({name:'followers',value:[]}));
    yield put(setItemValue({name:'followersLastPageNumber',value:0}));
    yield put(setItemValue({name:'followersLast',value:false}));
    yield put(setItemValue({name:'followCustomerId',value:payload.customer.id}));
    yield put(appendFollows(payload.key));
  }
}
const followsRequest = (type, pageNumber,customerId)=>
http({
  path: "follows/customer?type="+type+"&page_number="+pageNumber+"&customer_id="+customerId,
  method: "GET"
}).then(response => response.data);
function* onAppendFollows({payload}){
  let follows; 
  let pageNumber;
  let last;
  if(payload === 'followings'){
    follows = yield select(({notification})=>notification.followings);
    pageNumber = yield select(({notification})=>notification.followingsLastPageNumber);
    last = yield select(({notification})=>notification.followingsLast);
  }else{
    follows = yield select(({notification})=>notification.followers);
    pageNumber = yield select(({notification})=>notification.followersLastPageNumber);
    last = yield select(({notification})=>notification.followersLast);
  }
  const customerId = yield select(({notification})=>notification.followCustomerId);
  if(!last){
    try{
      const result = yield call(followsRequest, payload,pageNumber,customerId);
      if(result.follows.length>0){
        follows = follows.concat(result.follows);
        pageNumber++;
        yield put(setItemValue({name:payload,value:follows}));
        yield put(setItemValue({name:payload+'LastPageNumber',value:pageNumber}));
        if(result.next==0)yield put(setItemValue({name:payload+'Last',value:true}));
      }else{
        yield put(setItemValue({name:payload+'Last',value:true}));
      }
    }catch(e){

    }
  }
}
export default function* rootSaga() {
  yield takeLeading(searchNotifications,onSearchNotifications);
  yield takeLeading(findFollows,onFindFollows);
  yield takeLeading(follow,onFollow);
  yield takeLeading(unfollow,onUnfollow);
  yield takeLeading(accept,onAccept);
  yield takeLeading(reject,onReject);
  yield takeLeading(block,onBlock);
  yield takeLeading(unblock,onUnblock);
  yield takeLeading(mute,onMute);
  yield takeLeading(unmute,onUnmute);
  yield takeLeading(showFollows,onShowFollows);
  yield takeLeading(appendFollows, onAppendFollows);
}