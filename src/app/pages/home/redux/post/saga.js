import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  findNewsfeed, 
  setNewsfeed,   
  appendNewsfeedBefore,
  appendNewsfeedAfter,
  addNewsfeedBefore,
  addNewsfeedAfter,
  createPost,
  updatePost,
  openEditModal,
  findCustomerPosts,
  appendCustomerPostsAfter,
  addCustomerPostsAfter,
  setCustomerPosts,
  findPost,
  setItemValue,
  findRandomMedias,
  appendCustomerPostMediasAfter,
  addCustomerPostMediasAfter,
  deletePost,
  removePostStore,
} from "./actions";
import { http } from "../../services/api";

const findNewsfeedRequest = ()=>
  http({
    path: "customers/newsfeed",
    method: "POST",
  }).then(response => response.data);

function* onFindNewsfeed(){
  try {
    const result = yield call(findNewsfeedRequest);
    yield put(setNewsfeed(result.newsfeed));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const appendNewsfeedBeforeRequest = (ids)=>
  http({
    path: "posts/sub-newsfeed",
    method: "POST",
    data: {
      ids
    }
  }).then(response => response.data);
function* onAppendNewsfeedBefore({payload}){
  try {
    const result = yield call(appendNewsfeedBeforeRequest, payload);
    yield put(addNewsfeedBefore(result.items));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const appendNewsfeedAfterRequest = (post_id)=>
  http({
    path: "customers/newsfeed",
    method: "POST",
    data:{post_id}
  }).then(response => response.data);
function* onAppendNewsfeedAfter(){
  const id = yield select(({post})=>post.newsfeedLastId);
  try {
    const result = yield call(appendNewsfeedAfterRequest, id);
    console.log(result)
    yield put(addNewsfeedAfter(result.newsfeed));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const createPostRequest = ({files, location, tagFollowers, content})=>{
  let formData =  new FormData;
  if(location)formData.append("location", location);
  formData.append("content", content);
  const followers = tagFollowers.map((tagFollower)=>tagFollower.id);
  formData.append("tag_followers", JSON.stringify(followers));
  if (files) {
    files.forEach((file, i) => {
      formData.append(`medias[${i}]`, file.file);
    });
  }

  return http({
    path: "posts",
    method: "POST",
    data: formData
  }).then(response => response.data);
}
function* onCreatePost({payload}){
  try{
    const result = yield call(createPostRequest, payload);
  }catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  } 
}
const updatePostRequest = ({files, location, tagFollowers, content,id})=>{
  let formData =  new FormData;
  if(location)formData.append("location", location);
  formData.append("content", content);
  const followers = tagFollowers.map((tagFollower)=>tagFollower.id);
  formData.append("tag_followers", JSON.stringify(followers));
  formData.append("_method", "put");
  if (files) {
    files.forEach((file, i) => {
      if(file.file)formData.append(`medias[${i}]`, file.file);
      else formData.append(`media_ids[${i}]`, file.id);
    });
  }

  return http({
    path: "posts/"+id,
    method: "POST",
    data: formData
  }).then(response => response.data);
}
function* onUpdatePost({payload}){
  try{
    const result = yield call(updatePostRequest, payload);
  }catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  } 
}
const findCustomerPostsRequest = (customerId)=>
  http({
    path: "posts?customer_id="+customerId,
    method: "GET",
  }).then(response => response.data);

function* onFindCustomerPosts({payload}){
  try {
    const result = yield call(findCustomerPostsRequest,payload);
    yield put (setItemValue({name:'customerProfile',value:result.customerProfile}))
    yield put(setCustomerPosts(result.posts));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const appendCustomerPostsAfterRequest = (customerId,post_id)=>
  http({
    path: "posts?customer_id="+customerId + "&post_id=" + post_id,
    method: "GET",
  }).then(response => response.data);
function* onAppendCustomerPostsAfter({payload}){
  const id = yield select(({post})=>post.customerPostsLastId);
  try {
    const result = yield call(appendCustomerPostsAfterRequest, payload,id);
    yield put(addCustomerPostsAfter(result.posts));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const findPostRequest = (id)=>
  http({
    path: "posts/"+id,
    method: "GET",
  }).then(response => response.data);
function* onFindPost({payload}){
  console.log(payload)
  try{
    const result = yield call(findPostRequest,payload);
    yield put(setItemValue({name:"post",value:result}));
  } catch(error){

  }
}
const onFindRandomMediasRequest = (customerId)=>
  http({
    path: "posts/random-medias/"+customerId,
    method: "GET",
  }).then(response => response.data);
function* onFindRandomMedias({payload}){
  try{
    const result = yield call(onFindRandomMediasRequest,payload);
    yield put(setItemValue({name:"selfRandomMedias",value:result.self}));
    yield put(setItemValue({name:"otherRandomMedias",value:result.other}));
  } catch(error){

  }
}
const appendCustomerPostMediasAfterRequest = (customerId,media_id)=>
  http({
    path: "posts/medias?customer_id="+customerId + "&media_id=" + media_id,
    method: "GET",
  }).then(response => response.data);
function* onAppendCustomerPostMediasAfter({payload}){
  const id = yield select(({post})=>post.selfMediasLastId);
  try {
    const result = yield call(appendCustomerPostMediasAfterRequest, payload,id);
    yield put(addCustomerPostMediasAfter(result.medias));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const deletePostRequest = (id)=>
  http({
    path: "posts/"+id,
    method: "DELETE",
  }).then(response => response.data);
function* onDeletePost({payload}){
  try {
    const result = yield call(deletePostRequest, payload.id);
    yield put(removePostStore(payload.id));
    yield put(findRandomMedias(payload.customer_id));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
function* onOpenEditModal({payload}){
  if(payload.tagFollowers === undefined){
    try{
      const result = yield call(findPostRequest,payload);
      yield put(setItemValue({name:"editPost",value:result}));  
    }catch(e){

    }
  }else{
    yield put(setItemValue({name:"editPost", value:payload}));
  }
}
export default function* rootSaga() {
  yield takeLeading(findNewsfeed,onFindNewsfeed);
  yield takeLeading(appendNewsfeedBefore,onAppendNewsfeedBefore);
  yield takeLeading(appendNewsfeedAfter,onAppendNewsfeedAfter);
  yield takeLeading(createPost, onCreatePost);
  yield takeLeading(updatePost, onUpdatePost);
  yield takeLeading(findCustomerPosts,onFindCustomerPosts);
  yield takeLeading(appendCustomerPostsAfter,onAppendCustomerPostsAfter);
  yield takeLeading(findPost,onFindPost);
  yield takeLeading(findRandomMedias, onFindRandomMedias);
  yield takeLeading(appendCustomerPostMediasAfter,onAppendCustomerPostMediasAfter);
  yield takeLeading(deletePost, onDeletePost);
  yield takeLeading(openEditModal, onOpenEditModal);
}
