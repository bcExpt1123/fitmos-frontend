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
  createComment,
  updateComment,
  deleteComment,
  createReply,
  appendComments,
  appendNextComments,
  syncPosts,
  toggleLike,
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
const createCommentRequest = (postId,content,minLevel0,minLevel1,maxLevel0,maxLevel1)=>
  http({
    path: "comments",
    method: "POST",
    data:{
      post_id:postId,
      content,
      condition:{
        minLevel0,
        minLevel1,
        maxLevel0,
        maxLevel1,
        id:postId        
      }
    }
  }).then(response => response.data);
function* onCreateComment({payload}){
  const [posts, type, post] = yield call(getPosts,payload.post_id);
  const [minLevel0,minLevel1,maxLevel0,maxLevel1] = getCommentRange(post);
  try{
    const result = yield call(createCommentRequest, payload.post_id, payload.content,minLevel0,minLevel1,maxLevel0,maxLevel1);
    if(type){
      const newPosts = posts.map(post=>{
        if(post.id == payload.post_id){
          post.comments.push(result.comment);          
          post.commentsCount++;
        }
        return post;
      });
      if(type=="customer"){
        yield put(setItemValue({name:"customerPosts", value:newPosts}));
        const newsfeed = yield select(({post})=>post.newsfeed);
        const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
        if(checkNewsfeed){
          const newPosts = newsfeed.map(post=>{
            if(post.id == payload.post_id){
              post.previousCommentsCount = result.previousCommentsCount;
              post.comments = result.comments;
              post.nextCommentsCount = result.nextCommentsCount;
            }
            return post;
          });        
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
        }
      }else{
        yield put(setItemValue({name:"newsfeed", value:newPosts}));
      }
    }
  }catch(error){

  }
}
const createReplyRequest = (postId,content,parent_activity_id,minLevel0,minLevel1,maxLevel0,maxLevel1)=>
  http({
    path: "comments",
    method: "POST",
    data:{
      post_id:postId,
      parent_activity_id,
      content,
      condition:{
        minLevel0,
        minLevel1,
        maxLevel0,
        maxLevel1,
        id:postId
      }
    }
  }).then(response => response.data);
function findWithAttr(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}  
function* onCreateReply({payload}){
  const [posts, type, post] = yield call(getPosts,payload.post_id);
  const [minLevel0,minLevel1,maxLevel0,maxLevel1] = getCommentRange(post);
  try{
    const result = yield call(createReplyRequest, payload.post_id, payload.content,payload.parent_activity_id,minLevel0,minLevel1,maxLevel0,maxLevel1);
    if(type){
      const newPosts = posts.map(post=>{
        if(post.id == payload.post_id){
          const comments = [...post.comments];
          comments.reverse();
          const latestReplyPosition = findWithAttr(comments,'parent_activity_id',result.comment.parent_activity_id);    
          // post.comments.push(result.comment);    
          post.comments.splice(comments.length - latestReplyPosition,0, result.comment);
          post.commentsCount++;
        }
        return post;
      });
      if(type=="customer"){
        yield put(setItemValue({name:"customerPosts", value:newPosts}));
        const newsfeed = yield select(({post})=>post.newsfeed);
        const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
        if(checkNewsfeed){
          const newPosts = newsfeed.map(post=>{
            if(post.id == payload.post_id){
              post.previousCommentsCount = result.previousCommentsCount;
              post.comments = result.comments;
              post.nextCommentsCount = result.nextCommentsCount;
            }
            return post;
          });
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
        }  
      }else{
        yield put(setItemValue({name:"newsfeed", value:newPosts}));
      }
    }
  }catch(error){

  }
}
const appendCommentsRequest = (postId,level0, level1)=>
  http({
    path: "comments?post_id="+postId+"&level0="+level0+"&level1="+level1+"&type=append",
    method: "GET",
  }).then(response => response.data);
function* getPosts(postId){
  let posts;
  let type;
  let item;
  const customerPosts = yield select(({post})=>post.customerPosts);
  if(customerPosts)item = customerPosts.find(item=>item.id == postId);
  if(item){
    type = "customer";
    posts = [...customerPosts];
  }else{
    const newsfeed = yield select(({post})=>post.newsfeed);
    item = newsfeed.find(item=>item.id == postId);
    if(item){
      type = "newsfeed";
      posts = [...newsfeed];
    }
  }
  return [posts, type,item];
}
  
function* onAppendComments({payload}){
  let [posts, type, post] = yield call(getPosts,payload);
  if(post){
    let level0 = -1;
    let level1 = -1;
    if(post.comments.length>0){
      level0 = post.comments[0].level0;
      level1 = post.comments[0].level1;
    }
    try {
      const result = yield call(appendCommentsRequest,payload, level0, level1);
      if(result.comments && result.comments.length>0){
        const comments = [...result.comments];
        comments.reverse();
        const newPosts = posts.map(item=>{
          if(item.id == post.id){
            item.comments = [...comments,...item.comments];
            item.previousCommentsCount = item.previousCommentsCount - comments.length;
          }
          return item;
        });
        if(type=="customer"){
          yield put(setItemValue({name:"customerPosts", value:newPosts}));
          const newsfeed = yield select(({post})=>post.newsfeed);
          post = newsfeed.find(item=>item.id == payload);
          if(post){
            const newPosts = newsfeed.map(item=>{
              if(item.id == post.id){
                item.comments = [...comments,...item.comments];
                item.previousCommentsCount = item.previousCommentsCount - comments.length;
              }
              return post;
            });
            yield put(setItemValue({name:"newsfeed", value:newPosts}));
          }      
        }else{
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
        }        
      }
    }catch(error){

    }
  }
}
const appendNextCommentsRequest = (postId,level0, level1)=>
  http({
    path: "comments?post_id="+postId+"&level0="+level0+"&level1="+level1+"&type=appendNext",
    method: "GET",
  }).then(response => response.data);

function* onAppendNextComments({payload}){
  let [posts, type, post] = yield call(getPosts,payload);
  if(post){
    let level0 = -1;
    let level1 = -1;
    if(post.comments.length>0){
      level0 = post.comments[post.comments.length-1].level0;
      level1 = post.comments[post.comments.length-1].level1;
    }
    try {
      const result = yield call(appendNextCommentsRequest,payload, level0, level1);
      if(result.comments && result.comments.length>0){
        const comments = [...result.comments];
        const newPosts = posts.map(item=>{
          if(item.id == post.id){
            item.comments = [...item.comments,...comments];
            item.nextCommentsCount = 0;
          }
          return item;
        });
        if(type=="customer"){
          yield put(setItemValue({name:"customerPosts", value:newPosts}));
          const newsfeed = yield select(({post})=>post.newsfeed);
          post = newsfeed.find(item=>item.id == payload);
          if(post){
            const newPosts = newsfeed.map(item=>{
              if(item.id == post.id){
                item.comments = [...item.comments,...comments];
                item.nextCommentsCount = 0;
              }
              return post;
            });
            yield put(setItemValue({name:"newsfeed", value:newPosts}));
          }      
        }else{
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
        }        
      }
    }catch(error){

    }
  }
}
const updateCommentRequest = (id, content)=>
  http({
    path: "comments/"+id,
    method: "PUT",
    data:{
      content
    }
  }).then(response => response.data);
function* onUpdateComment({payload}){
  const [posts, type,post] = yield call(getPosts,payload.post_id);
  try{
    const result = yield call(updateCommentRequest,payload.id, payload.content);
    if(type){
      const newPosts = posts.map(post=>{
        if(post.id == payload.post_id){
          const comments = post.comments.map(comment=>{
            if(comment.id === payload.id)comment.content = result.comment.content;
            return comment;
          });
          post.comments = [...comments];
        }
        return post;
      });
      if(type=="customer"){
        yield put(setItemValue({name:"customerPosts", value:newPosts}));
        const newsfeed = yield select(({post})=>post.newsfeed);
        const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
        if(checkNewsfeed){
          const newPosts = newsfeed.map(post=>{
            if(post.id == payload.post_id){
              const comments = post.comments.map(comment=>{
                if(comment.id === payload.id)comment.content = result.comment.content;
                return comment;
              });
              post.comments = [...comments];
            }
            return post;
          });
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
        }  
      }else{
        yield put(setItemValue({name:"newsfeed", value:newPosts}));
      }
    }
  }catch(e){

  }
}
const deleteCommentRequest = (commentId,minLevel0,minLevel1,maxLevel0,maxLevel1,postId)=>
  http({
    path: "comments/"+commentId,
    method: "DELETE",
    data:{
      condition:{
        minLevel0,
        minLevel1,
        maxLevel0,
        maxLevel1,
        id:postId
      }
    }
  }).then(response => response.data);
function* onDeleteComment({payload}){
  const [posts, type,post] = yield call(getPosts,payload.post_id);
  const [minLevel0,minLevel1,maxLevel0,maxLevel1] = getCommentRange(post);
  try{
    const result = yield call(deleteCommentRequest,payload.id, minLevel0,minLevel1,maxLevel0,maxLevel1,payload.post_id);
    if(type){
      const newPosts = posts.map(post=>{
        if(post.id == payload.post_id){
          const comments = [...post.comments];
          post.comments = comments.filter(comment=>comment.id!=payload.id)
          post.commentsCount--;
        }
        return post;
      });
      if(type=="customer"){
        yield put(setItemValue({name:"customerPosts", value:newPosts}));
        const newsfeed = yield select(({post})=>post.newsfeed);
        const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
        if(checkNewsfeed){
          const newPosts = newsfeed.map(post=>{
            if(post.id == payload.post_id){
              post.previousCommentsCount = result.previousCommentsCount;
              post.comments = result.comments;
              post.nextCommentsCount = result.nextCommentsCount;
            }
            return post;
          });
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
        }  
      }else{
        yield put(setItemValue({name:"newsfeed", value:newPosts}));
      }
    }
  }catch(e){
    console.log(e)
  }
}
const getCommentRange = (post)=>{
  let minLevel0=-1;
  let minLevel1=-1;
  let maxLevel0=-1;
  let maxLevel1=-1;
  if(post.comments.length>0){
    minLevel0 = post.comments[0].level0;
    minLevel1 = post.comments[0].level1;
    maxLevel0 = post.comments[post.comments.length-1].level0;
    maxLevel1 = post.comments[post.comments.length-1].level1;
  }
  return [minLevel0,minLevel1,maxLevel0,maxLevel1];
}
const syncRequest = (ids)=>
  http({
    path: "posts/sync",
    method: "POST",
    data:{
      ids
    }
  }).then(response => response.data);
function* onSyncPosts({payload}){
  let postData;
  let newsfeed, customerPosts, newPosts;
  if(Array.isArray(payload)){
    newsfeed = yield select(({post})=>post.newsfeed);
    customerPosts = yield select(({post})=>post.customerPosts);
    const posts = [...newsfeed, ...customerPosts];
    const filtedPosts = posts.filter(post=>payload.some(id=>id==post.id));
    postData = filtedPosts.map(post=>{
      const [minLevel0,minLevel1,maxLevel0,maxLevel1] = getCommentRange(post);
      return{
        id:post.id,
        minLevel0,
        minLevel1,
        maxLevel0,
        maxLevel1,
      }
    });
    console.log(postData)
  }else{
    return;
  }
  try{
    const result = yield call(syncRequest, postData);
    newsfeed = yield select(({post})=>post.newsfeed);
    customerPosts = yield select(({post})=>post.customerPosts);
    newPosts = newsfeed.map(post=>{
      const item = result.posts.find(item=>item.id == post.id);
      if(item){
        post = {...item};
      }
      return post;
    });
    yield put(setItemValue({name:"newsfeed", value:newPosts}));
    newPosts = customerPosts.map(post=>{
      const item = result.posts.find(item=>item.id == post.id);
      if(item){
        post = {...item};
      }
      return post;
    });
    yield put(setItemValue({name:"customerPosts", value:newPosts}));
  }catch(e){
    console.log(e)
  }
}
const likeRequest = (activity_id)=>
  http({
    path: "likes",
    method: "POST",
    data:{
      activity_id
    }
  }).then(response => response.data);
const unlikeRequest = (activity_id)=>
  http({
    path: "likes/"+activity_id,
    method: "DELETE",
  }).then(response => response.data);

function* onToggleLike({payload}){
  try{
    let result;
    if(payload.like){
      result = yield call(unlikeRequest, payload.activity_id);
    }else{
      result = yield call(likeRequest, payload.activity_id);
    }
  }catch(e){

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
  yield takeLeading(createComment, onCreateComment);
  yield takeLeading(createReply, onCreateReply);
  yield takeLeading(appendComments, onAppendComments);
  yield takeLeading(appendNextComments, onAppendNextComments)
  yield takeLeading(deleteComment, onDeleteComment);
  yield takeLeading(updateComment, onUpdateComment);
  yield takeLeading(syncPosts, onSyncPosts);
  yield takeLeading(toggleLike, onToggleLike);
}
