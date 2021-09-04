import { call, takeLeading, select,put, delay, takeEvery } from "redux-saga/effects";
import {
  findNewsfeed, 
  setNewsfeed,   
  appendNewsfeedAfter,
  addNewsfeedAfter,
  refreshNewsfeed,
  createPost,
  updatePost,
  openEditModal,
  findCustomerPosts,
  appendCustomerPostsAfter,
  addCustomerPostsAfter,
  setCustomerPosts,
  refreshCustomerPosts, 
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
  appendNextReplies,
  hideReplies,
  syncPosts,
  toggleLike,
  readingPost,
  appendSuggestedPosts,
  refreshSuggestedPosts, 
  refreshPosts,
  convertOldNewsfeed,
  appendOldNewsfeed,
  refreshOldNewsfeed,
} from "./actions";
import { http } from "../../services/api";

const findNewsfeedRequest = ()=>
  http({
    path: "customers/newsfeed",
    method: "POST",
    data:{
      suggested:0
    }
  }).then(response => response.data);

function* onFindNewsfeed(){
  yield put(setItemValue({name:'old',value:0}));
  try {
    const result = yield call(findNewsfeedRequest);
    if(!result.next){
      yield put(setNewsfeed(result.newsfeed));
      yield put(setItemValue({name:"newsfeedLast",value:true}));
      yield put(setItemValue({name:"suggested", value:1}));
      yield put(appendSuggestedPosts());
      yield call(convertOldNewsfeed);
      yield put(appendOldNewsfeed());
    }else{
      yield put(setNewsfeed(result.newsfeed));
    }
    yield put(setItemValue({name:'videoPlayer',value:false}));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const appendNewsfeedAfterRequest = (post_id,suggested)=>
  http({
    path: "customers/newsfeed",
    method: "POST",
    data:{post_id,suggested}
  }).then(response => response.data);
function* onAppendNewsfeedAfter(){
  const id = yield select(({post})=>post.newsfeedLastId);
  const suggested = yield select(({post})=>post.suggested);
  if(suggested === 1)yield put(setItemValue({name:"suggested", value:0}));
  try {
    let result = yield call(appendNewsfeedAfterRequest, id,0);
    if(suggested === 0 ){
      if(!result.next){
        yield put(addNewsfeedAfter(result.newsfeed));
        yield put(setItemValue({name:"newsfeedLast",value:true}));
        yield put(setItemValue({name:"suggested", value:1}));
        yield put(appendSuggestedPosts());
        yield put(appendOldNewsfeed());
      }else{
        yield put(addNewsfeedAfter(result.newsfeed));
      }
    }
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
function* onRefreshNewsfeed(){
  const visible = yield select(({post})=>post.newsfeedTopVisible);
  if(visible){
    yield put(findNewsfeed());
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
  yield put(setItemValue({name:"savingPost",value:true}));
  try{
    const result = yield call(createPostRequest, payload);
    yield put(setItemValue({name:"savingPost",value:false}));
  }catch (error) {
    console.log(error);
    yield put(setItemValue({name:"savingPost",value:false}));
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
  yield put(setItemValue({name:"savingPost",value:true}));
  try{
    const result = yield call(updatePostRequest, payload);
    yield put(setItemValue({name:"savingPost",value:false}));
  }catch (error) {
    console.log(error);
    yield put(setItemValue({name:"savingPost",value:false}));
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
    yield put(setItemValue({name:'customerPostsFirstLoading',value:true}))
    const result = yield call(findCustomerPostsRequest,payload);
    yield put(setItemValue({name:'customerProfile',value:result.customerProfile}))
    yield put(setCustomerPosts(result.posts));
    yield put(setItemValue({name:'customerPostsFirstLoading',value:false}))
  } catch (error) {
    console.log(error);
    yield put(setItemValue({name:'customerPostsFirstLoading',value:false}))
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
function* onRefreshCustomerPosts(){
  const visible = yield select(({post})=>post.customerPostsTopVisible);
  if(visible){
    const customer = yield select(({people})=>people.username)
    if(customer.type=='customer')yield put(findCustomerPosts(customer.id));
  }
}
const findPostRequest = (id,comment)=>
  http({
    path: "posts/"+id+"?comment="+comment,
    method: "GET",
  }).then(response => response.data);
function* onFindPost({payload}){
  try{
    const result = yield call(findPostRequest,payload.id,payload.comment);
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
const createCommentRequest = (postId,content,from_id)=>
  http({
    path: "comments",
    method: "POST",
    data:{
      post_id:postId,
      content,
      condition:{
        from_id        
      }
    }
  }).then(response => response.data);
const replaceComments = (post,result)=>{
  post.previousCommentsCount = result.previousCommentsCount;
  const comments = result.comments.map(newComment=>{
    const oldComment = post.comments.find(comment=>comment.id == newComment.id);    
    if(oldComment&&oldComment.children.length>0){
      newComment.children = oldComment.children;
      newComment.nextChildrenCount = newComment.nextChildrenCount - newComment.children.length;
    }
    return newComment;
  });
  post.comments = comments;

  // post.comments = result.comments;
  post.nextCommentsCount = result.nextCommentsCount;
  post.commentsCount = result.commentsCount;
  return post;  
}  
const changePostComments = (oldPost,oldComment,result)=>(post)=>{
  if(post.id == oldComment.post_id){
    post = replaceComments(post,result);
  }
  return post;  
}  
function* updatePosts(posts, type, oldPostId,oldPost, oldComment, result, isModalPost,callback){
  if(type){
    const newPosts = posts.map(callback(oldPost,oldComment, result));
    if(type=="customer"){
      yield put(setItemValue({name:"customerPosts", value:newPosts}));
      const newsfeed = yield select(({post})=>post.newsfeed);
      const checkNewsPost = newsfeed.find(item=>item.id == oldPostId);
      if(checkNewsPost){
        const newPosts = newsfeed.map(callback(checkNewsPost,oldComment, result));
        yield put(setItemValue({name:"newsfeed", value:newPosts}));
      }
      const suggestedPosts = yield select(({post})=>post.suggestedPosts);
      const checkSuggestedPost = suggestedPosts.find(item=>item.id == oldPostId);
      if(checkSuggestedPost){
        const newPosts = suggestedPosts.map(callback(checkSuggestedPost,oldComment, result));
        yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
      }
    }else{
      switch(type){
        case "newsfeed":
          yield put(setItemValue({name:"newsfeed", value:newPosts}));
          break;
        case "suggestedPosts":
          yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
          break;
        case "oldNewsfeed":
          yield put(setItemValue({name:"oldNewsfeed", value:newPosts}));
          break;
      }
    }
  }  
}
function* onCreateComment({payload}){
  let [posts, type, post, isModalPost] = yield call(getPosts,payload.post_id);
  let fromId,toId;
  if(isModalPost){
    post = yield select(({post})=>post.post);    
  }
  [fromId,toId] = getCommentRange(post);    
  try{
    const result = yield call(createCommentRequest, payload.post_id, payload.content,fromId);
    if(isModalPost){
      post = yield call(replaceComments,post,result);
      yield put(setItemValue({name:"post", value:post}));
    }else{
      if(type)yield call(updatePosts,posts,type,payload.post_id, null, payload, result, isModalPost,changePostComments);
    }
  // if(type){
  //   const newPosts = posts.map(changePostComments(payload, result));
  //   if(type=="customer"){
  //     yield put(setItemValue({name:"customerPosts", value:newPosts}));
  //     const newsfeed = yield select(({post})=>post.newsfeed);
  //     const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
  //     if(checkNewsfeed){
  //       const newPosts = newsfeed.map(changePostComments(payload, result));
  //       yield put(setItemValue({name:"newsfeed", value:newPosts}));
  //     }
  //     const suggestedPosts = yield select(({post})=>post.suggestedPosts);
  //     const checkSuggestedPosts = suggestedPosts.some(item=>item.id == payload.post_id);
  //     if(checkSuggestedPosts){
  //       const newPosts = suggestedPosts.map(changePostComments(payload, result));
  //       yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
  //     }
  //   }else{
  //     if(type=="newsfeed"){
  //       yield put(setItemValue({name:"newsfeed", value:newPosts}));
  //     }else{
  //       yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
  //     }
      
  //   }
  // }
  }catch(error){
    console.log(error)
  }
}
const createReplyRequest = (postId,content,parent_activity_id)=>
  http({
    path: "comments",
    method: "POST",
    data:{
      post_id:postId,
      parent_activity_id,
      content
    }
  }).then(response => response.data);
// function findWithAttr(array, attr, value) {
//   for(var i = 0; i < array.length; i += 1) {
//       if(array[i][attr] === value) {
//           return i;
//       }
//   }
//   return -1;
// }  
const replaceCommentReplies = (post , oldComment, result)=>{
  const comments = post.comments.map(comment=>{
    if(comment.activity_id == oldComment.parent_activity_id){
      comment.children = result.comments;
      comment.nextChildrenCount = result.nextChildrenCount;
    }
    return comment;
  });
  post.comments = comments;
  post.commentsCount = result.commentsCount;  
  return post;
}
const changeCreateReplies = (oldPost,oldComment, result)=>(post)=>{
  if(post.id == oldComment.post_id){
    post = replaceCommentReplies(post, oldComment, result);
  }
  return post;  
}
function* onCreateReply({payload}){
  let [posts, type, post, isModalPost] = yield call(getPosts,payload.post_id);
  if(isModalPost){
    post = yield select(({post})=>post.post);    
  }
  try{
    const result = yield call(createReplyRequest, payload.post_id, payload.content,payload.parent_activity_id);
    if(isModalPost){
      post = yield call(replaceCommentReplies, post, payload, result);
      yield put(setItemValue({name:"post", value:post}));
    }else{
      if(type)yield call(updatePosts,posts,type,payload.post_id, null, payload, result, isModalPost,changeCreateReplies);
    }
    // if(type){
    //   const newPosts = posts.map(changeReplies(payload, result));
    //   if(type=="customer"){
    //     yield put(setItemValue({name:"customerPosts", value:newPosts}));
    //     const newsfeed = yield select(({post})=>post.newsfeed);
    //     const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
    //     if(checkNewsfeed){
    //       const newPosts = newsfeed.map(changeReplies(payload, result));
    //       yield put(setItemValue({name:"newsfeed", value:newPosts}));
    //     }  
    //     const suggestedPosts = yield select(({post})=>post.newsfeed);
    //     const checkSuggestedPosts = suggestedPosts.some(item=>item.id == payload.post_id);
    //     if(checkSuggestedPosts){
    //       const newPosts = suggestedPosts.map(changeReplies(payload, result));
    //       yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
    //     }  
    //   }else{
    //     if(type=="newsfeed"){
    //       yield put(setItemValue({name:"newsfeed", value:newPosts}));
    //     }else{
    //       yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
    //     }
    //   }
    // }
  }catch(error){

  }
}
const appendCommentsRequest = (id)=>
  http({
    path: "comments?id="+id+"&type=append",
    method: "GET",
  }).then(response => response.data);
function* getPosts(postId){
  let posts;
  let type;
  let item;
  let isModalPost;
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
    }else{
      const suggestedPosts = yield select(({post})=>post.suggestedPosts);
      item = suggestedPosts.find(item=>item.id == postId);
      if(item){
        type = "suggestedPosts";
        posts = [...suggestedPosts];
      }else{
        const oldNewsfeed = yield select(({post})=>post.oldNewsfeed);
        item = oldNewsfeed.find(item=>item.id == postId);
        if(item){
          type = "oldNewsfeed";
          posts = [...oldNewsfeed];
        }        
      }      
    }
  }
  const modalPost = yield select(({post})=>post.modalPost);
  if(modalPost){
    const post = yield select(({post})=>post.post);
    if(postId == post.id)isModalPost = true;
  }
  return [posts, type,item, isModalPost];
}
function* getPostsByActivity(activitytId){
  let names=[];
  let item;
  let level="post";// or comment or reply
  let isModalPost;
  const customerPosts = yield select(({post})=>post.customerPosts);
  if(customerPosts){
    item = customerPosts.find(item=>{
      const comment = item.comments.find(comment=>{
        const repley = comment.children.find(reply=>reply.activity_id == activitytId);
        if(repley) return true;
        return comment.activity_id == activitytId
      });
      if(comment) return true;
      return item.activity_id == activitytId;
    });
    if(item){
      names.push("customerPosts");
    }
  }
  const newsfeed = yield select(({post})=>post.newsfeed);
  if(newsfeed){
    item = newsfeed.find(item=>{
      const comment = item.comments?.find(comment=>{
        const repley = comment.children.find(reply=>reply.activity_id == activitytId);
        if(repley) return true;
        return comment.activity_id == activitytId
      });
      if(comment) return true;
      return item.activity_id == activitytId;
    });
    if(item){
      names.push("newsfeed");
    }
  }
  const suggestedPosts = yield select(({post})=>post.suggestedPosts);
  if(suggestedPosts){
      item = suggestedPosts.find(item=>{
      const comment = item.comments.find(comment=>{
        const repley = comment.children.find(reply=>reply.activity_id == activitytId);
        if(repley) return true;
        return comment.activity_id == activitytId
      });
      if(comment) return true;
      return item.activity_id == activitytId;
    });
    if(item){
      names.push("suggestedPosts");
    }
  }
  const oldNewsfeed = yield select(({post})=>post.oldNewsfeed);
  if(oldNewsfeed){
      item = oldNewsfeed.find(item=>{
      const comment = item.comments.find(comment=>{
        const repley = comment.children.find(reply=>reply.activity_id == activitytId);
        if(repley) return true;
        return comment.activity_id == activitytId
      });
      if(comment) return true;
      return item.activity_id == activitytId;
    });
    if(item){
      names.push("oldNewsfeed");
    } 
  }       
  const modalPost = yield select(({post})=>post.modalPost);
  if(modalPost){
    const post = yield select(({post})=>post.post);
    names.push("post");
    if(post.activity_id == activitytId)isModalPost = true;
  }
  return [names,item, isModalPost];
}
const changeAppendComments = (oldPost,oldComment,result)=>(item)=>{
  if(item.id == result.post.id){
    item.comments = [...result.comments,...item.comments];
    item.previousCommentsCount = item.previousCommentsCount - result.comments.length;
  }
  return item;  
}  
function* onAppendComments({payload}){
  let [posts, type, post, isModalPost] = yield call(getPosts,payload);
  if(post){
    let id = -1;
    if(post.comments.length>0){
      id = post.comments[0].id;
    }
    try {
      const result = yield call(appendCommentsRequest,id);
      if(result.comments && result.comments.length>0){
        const comments = [...result.comments];
        comments.reverse();
        yield call(updatePosts,posts,type,payload, null, null, {post,comments}, isModalPost,changeAppendComments);
        // const newPosts = posts.map(changeAppendComments(post,comments));
        // if(type=="customer"){
        //   yield put(setItemValue({name:"customerPosts", value:newPosts}));
        //   const newsfeed = yield select(({post})=>post.newsfeed);
        //   post = newsfeed.find(item=>item.id == payload);
        //   if(post){
        //     const newPosts = newsfeed.map(changeAppendComments(post,comments));
        //     yield put(setItemValue({name:"newsfeed", value:newPosts}));
        //   }      
        // }else{
        //   yield put(setItemValue({name:"newsfeed", value:newPosts}));
        // }        
      }
    }catch(error){

    }
  }
}
const appendNextCommentsRequest = (id)=>
  http({
    path: "comments?id="+id+"&type=appendNext",
    method: "GET",
  }).then(response => response.data);
const changeAppendNextComments = (oldPost,oldComment,result)=>(item)=>{
  if(item.id == result.post.id){
    item.comments = [,...item.comments,...result.comments];
    item.previousCommentsCount = item.previousCommentsCount - result.comments.length;
  }
  return item;  
}  
  
function* onAppendNextComments({payload}){
  let [posts, type, post,isModalPost] = yield call(getPosts,payload);
  if(post){
    let id = -1;
    if(post.comments.length>0){
      id = post.comments[post.comments.length-1].id;
    }
    try {
      const result = yield call(appendNextCommentsRequest,id);
      if(result.comments && result.comments.length>0){
        const comments = [...result.comments];
        yield call(updatePosts,posts,type,payload, null, null, {post,comments}, isModalPost,changeAppendNextComments);
        // const newPosts = posts.map(item=>{
        //   if(item.id == post.id){
        //     item.comments = [...item.comments,...comments];
        //     item.nextCommentsCount = item.nextCommentsCount - comments.length;
        //   }
        //   return item;
        // });
        // if(type=="customer"){
        //   yield put(setItemValue({name:"customerPosts", value:newPosts}));
        //   const newsfeed = yield select(({post})=>post.newsfeed);
        //   post = newsfeed.find(item=>item.id == payload);
        //   if(post){
        //     const newPosts = newsfeed.map(item=>{
        //       if(item.id == post.id){
        //         item.comments = [...item.comments,...comments];
        //         item.nextCommentsCount = item.nextCommentsCount - comments.length;
        //       }
        //       return post;
        //     });
        //     yield put(setItemValue({name:"newsfeed", value:newPosts}));
        //   }      
        // }else{
        //   yield put(setItemValue({name:"newsfeed", value:newPosts}));
        // }        
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
const replaceUpdateComment = (post,oldComment, result)=>{
  const comments = post.comments.map(comment=>{
    if(result.comment.level1>0){
      const children = comment.children.map((reply)=>{
        if(reply.id == oldComment.id)reply.content = result.comment.content;  
        return reply;
      });
      comment.children = children;
    }else{
      if(comment.id == oldComment.id)comment.content = result.comment.content;
    }
    return comment;
  });
  post.comments = [...comments];
  return post;
}
const changeUpdateComment = (oldPost,oldComment,result)=>(post)=>{
  if(post.id == oldComment.post_id){
    post = replaceUpdateComment(post,oldComment, result);
  }
  return post;
}  
  
function* onUpdateComment({payload}){
  let [posts, type,post, isModalPost] = yield call(getPosts,payload.post_id);
  if(isModalPost){
    post = yield select(({post})=>post.post);    
  }
  try{
    const result = yield call(updateCommentRequest,payload.id, payload.content);
    if(isModalPost){
      post = yield call(replaceUpdateComment,post,payload, result);
      yield put(setItemValue({name:"post", value:post}));
    }else{
      if(type){
        yield call(updatePosts,posts,type,payload.post_id, null, payload, result, isModalPost,changeUpdateComment);
        // const newPosts = posts.map(post=>{
        //   if(post.id == payload.post_id){
        //     const comments = post.comments.map(comment=>{
        //       if(result.comment.level1>0){
        //         const children = comment.children.map((reply)=>{
        //           if(reply.id == payload.id)reply.content = result.comment.content;  
        //           return reply;
        //         });
        //         comment.children = children;
        //       }else{
        //         if(comment.id == payload.id)comment.content = result.comment.content;
        //       }
        //       return comment;
        //     });
        //     post.comments = [...comments];
        //   }
        //   return post;
        // });
        // if(type=="customer"){
        //   yield put(setItemValue({name:"customerPosts", value:newPosts}));
        //   const newsfeed = yield select(({post})=>post.newsfeed);
        //   const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
        //   if(checkNewsfeed){
        //     const newPosts = newsfeed.map(post=>{
        //       if(post.id == payload.post_id){
        //         const comments = post.comments.map(comment=>{
        //           if(payload.level1>0){
        //             const children = comment.children.map((reply)=>{
        //               if(reply.id === payload.id)reply.content = result.comment.content;  
        //               return reply;
        //             });
        //             comment.children = children;
        //           }else{
        //             if(comment.id === payload.id)comment.content = result.comment.content;
        //           }
        //           return comment;
        //         });
        //         post.comments = [...comments];
        //       }
        //       return post;
        //     });
        //     yield put(setItemValue({name:"newsfeed", value:newPosts}));
        //   }  
        // }else{
        //   yield put(setItemValue({name:"newsfeed", value:newPosts}));
        // }      
      }  
    }
  }catch(e){

  }
}
const deleteCommentRequest = (commentId,fromId,toId)=>
  http({
    path: "comments/"+commentId,
    method: "DELETE",
    data:{
      from_id:fromId,
      to_id:toId
    }
  }).then(response => response.data);
const replaceDeleteComment = (post,oldComment, result)=>{
  if(oldComment.level1>0){
    const comments = post.comments.map(comment=>{
      if(comment.activity_id === oldComment.parent_activity_id){
        comment.children = result.children;
        comment.nextChildrenCount = result.nextChildrenCount;
      }
      return comment;
    });
    post.comments = [...comments];
  }else{
    post.previousCommentsCount = result.previousCommentsCount;
    post.comments = result.comments;
    post.nextCommentsCount = result.nextCommentsCount;
  }
  post.commentsCount = result.commentsCount;
  return post;
}  
const changeDeleteComment = (oldPost,oldComment,result)=>(post)=>{
  if(post.id == oldComment.post_id){
    post = replaceDeleteComment(post,oldComment, result);
  }
  return post;
}  
  
function* onDeleteComment({payload}){
  let [posts, type,post, isModalPost] = yield call(getPosts,payload.post_id);
  let fromId,toId; 
  if(isModalPost){
    post = yield select(({post})=>post.post);    
  }
  if(payload.level1>0){
    const comment = post.comments.find(item=>item.activity_id == payload.parent_activity_id);
    fromId  = -1;
    toId = -1;
    if(comment.children.length){
      toId = comment.children[comment.children.length-1].id;
    }
  }else{
    [fromId,toId] = getCommentRange(post);    
  }
  try{
    const result = yield call(deleteCommentRequest,payload.id,fromId,toId);
    if(isModalPost){
      post = yield call(replaceDeleteComment,post,payload, result);
      yield put(setItemValue({name:"post", value:post}));
    }else{
      if(type){
        yield call(updatePosts,posts,type,payload.post_id, null, payload, result, isModalPost,changeDeleteComment);
        // const newPosts = posts.map(post=>{
        //   if(post.id == payload.post_id){
        //     if(payload.level1>0){
        //       const comments = post.comments.map(comment=>{
        //         if(comment.activity_id === payload.parent_activity_id){
        //           comment.children = result.children;
        //           comment.commentsCount = result.commentsCount;
        //         }
        //         return comment;
        //       });
        //       post.comments = [...comments];
        //     }else{
        //       post.previousCommentsCount = result.previousCommentsCount;
        //       post.comments = result.comments;
        //       post.nextCommentsCount = result.nextCommentsCount;
        //     }
        //     post.commentsCount = result.commentsCount;
        //   }
        //   return post;
        // });
        // if(type=="customer"){
        //   yield put(setItemValue({name:"customerPosts", value:newPosts}));
        //   const newsfeed = yield select(({post})=>post.newsfeed);
        //   const checkNewsfeed = newsfeed.some(item=>item.id == payload.post_id);
        //   if(checkNewsfeed){
        //     const newPosts = newsfeed.map(post=>{
        //       if(post.id == payload.post_id){
        //         if(payload.level1>0){
        //           const comments = post.comments.map(comment=>{
        //             if(comment.activity_id === payload.parent_activity_id){
        //               comment.children = result.children;
        //               comment.commentsCount = result.commentsCount;
        //             }
        //             return comment;
        //           });
        //           post.comments = [...comments];
        //         }else{
        //           post.previousCommentsCount = result.previousCommentsCount;
        //           post.comments = result.comments;
        //           post.nextCommentsCount = result.nextCommentsCount;
        //         }
        //         post.commentsCount = result.commentsCount;
        //       }
        //       return post;
        //     });
        //     yield put(setItemValue({name:"newsfeed", value:newPosts}));
        //   }  
        // }else{
        //   yield put(setItemValue({name:"newsfeed", value:newPosts}));
        // }      
      }
    }
  }catch(e){
    console.log(e)
  }
}
const appendNextRepliesRequest = (id)=>
  http({
    path: "comments?id="+id+"&type=appendNextReplies",
    method: "GET",
  }).then(response => response.data);
const replaceAppendNextReplies = (oldPost,oldComment, post, replies)=>{
  const comments = oldPost.comments.map(comment=>{
    if(comment.id == oldComment.id){
      comment.children = [...comment.children, ...replies];
      comment.nextChildrenCount = comment.nextChildrenCount - replies.length;
    }
    return comment;
  });
  // console.log(comments)
  post.comments = comments;  
  return post;
}  
const changeAppendNextReplies = (oldPost,oldComment,replies)=>(post)=>{
  if(post.id == oldPost.id){
    post = replaceAppendNextReplies(oldPost,oldComment, post, replies);
  }
  return post;
}  
  
function* onAppendNextReplies({payload}){
  let [posts, type, post, isModalPost] = yield call(getPosts,payload.post_id);
  if(isModalPost){
    post = yield select(({post})=>post.post);
  }
  if(post){
    let id = -1;
    if(payload.children.length>0){
      id = payload.children[payload.children.length-1].id;
    }else{
      id = payload.id;
    }
    try {
      const result = yield call(appendNextRepliesRequest,id);
      if(result.comments && result.comments.length>0){
        const replies = [...result.comments];
        if(isModalPost){
          post = yield call(replaceAppendNextReplies,post,payload, post, replies);
          yield put(setItemValue({name:"post", value:post}));
        }else{
          if(type)yield call(updatePosts,posts,type,payload.post_id, post, payload, replies, isModalPost,changeAppendNextReplies);        
          // const newPosts = posts.map(item=>{
          //   if(item.id == post.id){
          //     const comments = post.comments.map(comment=>{
          //       if(comment.id == payload.id){
          //         comment.children = [...comment.children, ...replies];
          //         comment.nextChildrenCount = comment.nextChildrenCount - replies.length;
          //       }
          //       return comment;
          //     });
          //     console.log(comments)
          //     post.comments = comments;
          //   }
          //   return item;
          // });
          // if(type=="customer"){
          //   yield put(setItemValue({name:"customerPosts", value:newPosts}));
          //   const newsfeed = yield select(({post})=>post.newsfeed);
          //   post = newsfeed.find(item=>item.id == payload);
          //   if(post){
          //     const newPosts = newsfeed.map(item=>{
          //       if(item.id == post.id){
          //         const comments = post.comments.map(comment=>{
          //           if(comment.id == payload.id){
          //             comment.children = [...comment.children, ...replies];
          //             comment.nextChildrenCount = comment.nextChildrenCount - replies.length;
          //           }
          //           return comment;
          //         });
          //         post.comments = comments;
          //       }
          //       return post;
          //     });
          //     yield put(setItemValue({name:"newsfeed", value:newPosts}));
          //   }      
          // }else{
          //   yield put(setItemValue({name:"newsfeed", value:newPosts}));
          // }                    
        }
      }
    }catch(error){
      console.log(error)
    }
  }
}
const replaceHideReplies = (oldPost, oldComment,post)=>{
  const comments = oldPost.comments.map(comment=>{
    if(comment.id == oldComment.id){
      comment.nextChildrenCount = comment.nextChildrenCount + comment.children.length;
      comment.children = [];
    }
    return comment;
  });
  post.comments = comments;
  return post;
}
const changeHideReplies = (oldPost,oldComment,replies)=>(post)=>{
  if(post.id == oldPost.id){
    post = replaceHideReplies(oldPost, oldComment,post);
  }
  return post;
}  

function* onHideReplies({payload}){
  let [posts, type, post, isModalPost] = yield call(getPosts,payload.post_id);
  if(isModalPost){
    post = yield select(({post})=>post.post);
  }
  if(post){
    if(payload.children && payload.children.length>0){
      if(isModalPost){
        console.log(post);
        post = yield call(replaceHideReplies,post, payload,post);
        yield put(setItemValue({name:"post", value:post}));
      }else{
        if(type)yield call(updatePosts,posts,type,payload.post_id, post, payload, null, isModalPost,changeHideReplies);
      }
    }
  }
}
const getCommentRange = (post)=>{
  let fromId=-1;
  let toId=-1;
  if(Array.isArray(post.comments) && post.comments.length>0){
    fromId = post.comments[0].id;
    toId = post.comments[post.comments.length-1].id;
  }
  return [fromId,toId];
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
  let newsfeed,suggestedPosts, customerPosts, newPosts, oldNewsfeed;
  if(Array.isArray(payload)){
    newsfeed = yield select(({post})=>post.newsfeed);
    customerPosts = yield select(({post})=>post.customerPosts);
    suggestedPosts = yield select(({post})=>post.suggestedPosts);
    oldNewsfeed = yield select(({post})=>post.oldNewsfeed);
    if(window.location.pathname === '/newsfeed'){
      customerPosts = [];
    }else{
      newsfeed = [];
      suggestedPosts = [];
      oldNewsfeed = [];
    }
    const posts = [...newsfeed, ...customerPosts,...suggestedPosts,...oldNewsfeed];
    const filtedPosts = posts.filter(post=>payload.some(id=>id==post.id));
    postData = filtedPosts.map(post=>{
      const [fromId, toId] = getCommentRange(post);
      return {
        id:post.id,
        from_id:fromId,
        to_id:toId,
      }
    });
  }else{
    return;
  }
  try{
    const result = yield call(syncRequest, postData);
    newsfeed = yield select(({post})=>post.newsfeed);
    newPosts = newsfeed.map(changePost(result.posts));
    yield put(setItemValue({name:"newsfeed", value:newPosts}));
    suggestedPosts = yield select(({post})=>post.suggestedPosts);
    newPosts = suggestedPosts.map(changePost(result.posts));
    yield put(setItemValue({name:"suggestedPosts", value:newPosts}));
    customerPosts = yield select(({post})=>post.customerPosts);
    newPosts = customerPosts.map(changePost(result.posts));
    yield put(setItemValue({name:"customerPosts", value:newPosts}));
    oldNewsfeed = yield select(({post})=>post.oldNewsfeed);
    newPosts = customerPosts.map(changePost(result.posts));
    yield put(setItemValue({name:"oldNewsfeed", value:newPosts}));
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
const postUnlike = (post,activityId)=>{
  if(post.activity_id == activityId) {
    post.like=false;
    post.likesCount = post.likesCount - 1;
  }else{
    post.comments = post?.comments?.map(comment=>{
      if(comment.activity_id == activityId){
        comment.like=false;
        comment.likeCount = comment.likeCount - 1;
      }else{
        comment.children = comment.children.map(reply=>{
          if(reply.activity_id == activityId){
            reply.like=false;
            reply.likeCount = reply.likeCount - 1;
          }
          return reply;
        })
      }
      return comment;
    })
  }
  return post;
}
const postLike = (post,activityId)=>{
  if(post.activity_id == activityId) {
    post.like=true;
    post.likesCount = post.likesCount + 1;
  }else{
    post.comments = post?.comments?.map(comment=>{
      if(comment.activity_id == activityId){
        comment.like=true;
        comment.likeCount = comment.likeCount + 1;
      }else{
        comment.children = comment.children.map(reply=>{
          if(reply.activity_id == activityId){
            reply.like=true;
            reply.likeCount = reply.likeCount + 1;
          }
          return reply;
        })
      }
      return comment;
    })
  }
  return post;
}

function* onToggleLike({payload}){
  const [names,post, isModalPost] = yield call(getPostsByActivity,payload.activity_id);
  console.log(names,post);
  const store = yield select(({post})=>post);
  try{
    let result;
    let i;
    if(payload.like){
      result = yield call(unlikeRequest, payload.activity_id);
      for(i=0;i<names.length;i++){
        const name = names[i];
        const data = store[name];
        let newData;
        if(Array.isArray(data)){
          newData = data.map(post=>{
            post = postUnlike(post, payload.activity_id);
            return post;
          });
        }else{
          newData = postUnlike(data, payload.activity_id);
        }
        yield put(setItemValue({name,value:newData}))
      }
    }else{
      result = yield call(likeRequest, payload.activity_id);
      for(i=0;i<names.length;i++){
        const name = names[i];
        const data = store[name];
        let newData;
        if(Array.isArray(data)){
          newData = data.map(post=>{
            post = postLike(post, payload.activity_id);
            return post;
          });
        }else{
          newData = postLike(data, payload.activity_id);
        }
        yield put(setItemValue({name,value:newData}))
      }
    }
  }catch(e){
    console.log(e)
  }
}
const onReadingRequest = (id)=>
  http({
    path: "posts/"+id+"/read",
    method: "POST",
  }).then(response => response.data);
function* onReadingPost({payload}){
  const currentUser = yield select(({auth})=>auth.currentUser);
  try{
    // if(currentUser.customer.id!=payload.customer_id){
      const result = yield call(onReadingRequest, payload.id);
    // }    
  }catch(e){

  }
}
function* onAppendSuggestedPosts(){
  let id = yield select(({post})=>post.suggestedPostsLastId);
  const suggested = yield select(({post})=>post.suggested);
  if(suggested == 0)yield put(setItemValue({name:"suggested", value:1}));
  try {
    let result = yield call(appendNewsfeedAfterRequest, id,1);
    console.log(result.newsfeed)
    let suggestedPosts = yield select(({post})=>post.suggestedPosts);
    const filteredPostsAfter = result.newsfeed.filter((post)=>!suggestedPosts.some(item=>item.id == post.id));
    suggestedPosts = suggestedPosts.concat(filteredPostsAfter);
    if(filteredPostsAfter.length>0){
      const ids = filteredPostsAfter.filter((item)=>item.id == parseInt(item.id)).map(item=>item.id);
      id = Math.min(...ids);
    }
    yield put(setItemValue({name:"suggestedPosts", value:suggestedPosts}));
    yield put(setItemValue({name:"suggestedPostsLastId", value:id}));
    yield put(setItemValue({name:"suggestedPostsLast", value:!result.next}));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
function* onRefreshSuggestedPosts(){
  const visible = yield select(({post})=>post.newsfeedTopVisible);
  if(visible){
    yield put(findNewsfeed());
  }
}
const changePost = (newPosts)=>(post)=>{
  const item = newPosts.find(item=>item.id == post.id);
  if(item){
    const comments = item.comments.map(newComment=>{
      const oldComment = post.comments.find(comment=>comment.id == newComment.id);    
      if(oldComment&&oldComment.children.length>0){
        newComment.children = oldComment.children;
        newComment.nextChildrenCount = newComment.nextChildrenCount - newComment.children.length;
      }
      return newComment;
    });
    item.comments = comments;
    post = {...item};
  }
  return post;  
}
const replacePosts = (oldPosts)=>(post)=>{
  const item = oldPosts.find(item=>item.id == post.id);
  if(item){
    const comments = item.comments.map(oldComment=>{
      const newComment = post.comments.find(comment=>comment.id == oldComment.id);    
      if(newComment&&newComment.children){
        newComment.children = oldComment.children;
        newComment.nextChildrenCount = newComment.nextChildrenCount - oldComment.children.length;
      }
      return newComment;
    });
    post.comments = comments;
  }
  return post;  
}
function* onRefreshPosts(){
  const suggested = yield select(({post})=>post.suggested);
  const old = yield select(({post})=>post.old);
  let postData;
  let newsfeed, suggestedPosts, oldPosts, newPosts;
  if( old == 0 ){
    if( suggested ===  0 ){
      const posts = yield select(({post})=>post.newsfeed);
      postData = posts.map(post=>{
        const [fromId, toId] = getCommentRange(post);
        return{
          id:post.id,
          from_id:fromId,
          to_id:toId,
        }
      });
    }else{
      const posts = yield select(({post})=>post.suggestedPosts);
      postData = posts.map(post=>{
        const [fromId, toId] = getCommentRange(post);
        return{
          id:post.id,
          from_id:fromId,
          to_id:toId,
        }
      });
    }
  }else{
    oldPosts = yield select(({post})=>post.oldNewsfeed);
  }
  try{
    const result = yield call(syncRequest, postData);
    if( old == 0 ){
      if(suggested ===  0 ){
        newsfeed = yield select(({post})=>post.newsfeed);
        const filteredPosts = result.posts.filter((post)=>post.customer && post.customer.following!=null && post.customer.following.status=='accepted' && post.customer.relation!=undefined);
        newPosts = filteredPosts.map(replacePosts(newsfeed));
        yield put(setItemValue({name:"newsfeed", value:newPosts}));      
        if(newPosts.length ==0){
          yield put(appendSuggestedPosts());
        }
      }else{
        suggestedPosts = yield select(({post})=>post.suggestedPosts);
        const filteredPosts = result.posts.filter((post)=>(post.customer && post.customer.following==null || post.customer.following.status=='pending' )&&post.customer.relation!=undefined);
        newPosts = filteredPosts.map(replacePosts(suggestedPosts));
        yield put(setItemValue({name:"suggestedPosts", value:newPosts}));      
      }
    }else{
      oldPosts = yield select(({post})=>post.oldNewsfeed);
      const filteredPosts = result.posts.filter((post)=>post.customer && post.customer.following!=null&&  post.customer.following.status=='accepted' && post.customer.relation!=undefined);
      newPosts = filteredPosts.map(replacePosts(oldPosts));
      yield put(setItemValue({name:"oldNewsfeed", value:newPosts}));
    }
  }catch(e){
    console.log(e)
  }
}
function* onConvertOldNewsfeed(){
  yield put(setItemValue({name:'old',value:1}));
  yield put(setItemValue({name:'oldNewsfeed',value:[]}));
  yield put(setItemValue({name:'oldNewsfeedLastId',value:-1}));
  yield put(setItemValue({name:'oldNewsfeedLast',value:false}));
  yield put(appendOldNewsfeed());
}
const appendOldNewsfeedAfterRequest = (post_id)=>
  http({
    path: "customers/oldnewsfeed",
    method: "POST",
    data:{post_id}
  }).then(response => response.data);
function* onAppendOldNewsfeed(){
  let id = yield select(({post})=>post.oldNewsfeedLastId);
  try {
    let result = yield call(appendOldNewsfeedAfterRequest, id);
    let oldNewsfeed = yield select(({post})=>post.oldNewsfeed);
    const filteredPostsAfter = result.oldNewsfeed.filter((post)=>!oldNewsfeed.some(item=>item.id == post.id));
    oldNewsfeed = oldNewsfeed.concat(filteredPostsAfter);
    if(filteredPostsAfter.length>0){
      const ids = filteredPostsAfter.filter((item)=>item.id == parseInt(item.id)).map(item=>item.id);
      id = Math.min(...ids);
    }
    yield put(setItemValue({name:"oldNewsfeed", value:oldNewsfeed}));
    yield put(setItemValue({name:"oldNewsfeedLastId", value:id}));
    yield put(setItemValue({name:"oldNewsfeedLast", value:!result.next}));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
function* onRefreshOldNewsfeed(){
  const visible = yield select(({post})=>post.newsfeedTopVisible);
  if(visible){
    yield put(findNewsfeed());
  }
}
export default function* rootSaga() {
  yield takeLeading(findNewsfeed,onFindNewsfeed);
  yield takeLeading(appendNewsfeedAfter,onAppendNewsfeedAfter);
  yield takeLeading(refreshNewsfeed, onRefreshNewsfeed);
  yield takeLeading(createPost, onCreatePost);
  yield takeLeading(updatePost, onUpdatePost);
  yield takeLeading(findCustomerPosts,onFindCustomerPosts);
  yield takeLeading(appendCustomerPostsAfter,onAppendCustomerPostsAfter);
  yield takeLeading(refreshCustomerPosts, onRefreshCustomerPosts);
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
  yield takeLeading(  appendNextReplies,onAppendNextReplies);
  yield takeLeading(  hideReplies, onHideReplies );
  yield takeEvery( readingPost, onReadingPost );
  yield takeLeading( appendSuggestedPosts, onAppendSuggestedPosts );
  yield takeLeading( refreshSuggestedPosts, onRefreshSuggestedPosts );
  yield takeLeading( refreshPosts, onRefreshPosts);
  yield takeLeading( convertOldNewsfeed, onConvertOldNewsfeed);
  yield takeLeading( appendOldNewsfeed, onAppendOldNewsfeed);
  yield takeLeading( refreshOldNewsfeed, onRefreshOldNewsfeed );
}
