import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
  takeLeading,
  select,
} from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";

export const actionTypes = {
  EVENTO_INDEX_REQUEST: "EVENTO_INDEX_REQUEST",
  EVENTO_INDEX_SUCCESS: "EVENTO_INDEX_SUCCESS",
  EVENTO_INDEX_FAILURE: "EVENTO_INDEX_FAILURE",
  EVENTO_LOADING_REQUEST: "EVENTO_LOADING_REQUEST",
  EVENTO_SEARCH_REQUEST: "EVENTO_SEARCH_REQUEST",
  EVENTO_CHANGE_SEARCH_VALUE: "EVENTO_CHANGE_SEARCH_VALUE",
  EVENTO_ACTION_REQUEST: "EVENTO_ACTION_REQUEST",
  EVENTO_CHANGE_ITEM: "EVENTO_CHANGE_ITEM",
  EVENTO_SAVE_ITEM: "EVENTO_SAVE_ITEM",
  EVENTO_SET_ITEM: "EVENTO_SET_ITEM",
  EVENTO_NEW_ITEM_FETCH: "EVENTO_NEW_ITEM_FETCH",
  EVENTO_SET_ITEM_VALUE: "EVENTO_SET_ITEM_VALUE",
  EVENTO_SET_VALUE: "EVENTO_SET_VALUE",
  EVENTO_CHANGE_SAVE_STATUS: "EVENTO_CHANGE_SAVE_STATUS",
  EVENTO_SET_ITEM_ERROR: "EVENTO_SET_ITEM_ERROR",
  EVENTO_UPLOAD_IMAGE:"EVENTO_UPLOAD_IMAGE",
  EVENTO_TOGGLE_ATTEND:"EVENTO_TOGGLE_ATTEND",
  //for pagination
  EVENTO_INDEX_META: "EVENTO_INDEX_META",
  EVENTO_PAGE_CHANGED: "EVENTO_PAGE_CHANGED",
  EVENTO_PAGESIZE_CHANGED: "EVENTO_PAGESIZE_CHANGED",
  //for front page
  EVENTO_FRONT_INDEX_REQUEST:"EVENTO_FRONT_INDEX_REQUEST",
  EVENTO_FRONT_INDEX_SUCCESS:"EVENTO_FRONT_INDEX_SUCCESS",
  EVENTO_FRONT_INDEX_META: "EVENTO_FRONT_INDEX_META",
  EVENTO_FRONT_PAGE_CHANGED: "EVENTO_FRONT_PAGE_CHANGED",
  //for comment
  EVENTO_CREATE_COMMENT: "EVENTO_CREATE_COMMENT",
  EVENTO_DELETE_COMMENT: "EVENTO_DELETE_COMMENT",
  EVENTO_UPDATE_COMMENT: "EVENTO_UPDATE_COMMENT",
  EVENTO_APPEND_NEXT_REPLIES: "EVENTO_APPEND_NEXT_REPLIES",
  EVENTO_HIDE_REPLIES: "EVENTO_HIDE_REPLIES",
  EVENTO_CREATE_REPLY: "EVENTO_CREATE_REPLY",
};

export const selectors = {};

const initialState = {
  data: null,
  meta: {
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    total: 0
  },
  frontData:null,
  frontMeta: {
    page: 1,
    pageSize: 6,
    pageTotal: 1,
    total: 0
  },
  item: null,
  updatedItem: null,
  uploadImage:[],
  action: "",
  searchCondition: {
    search: ""
  },
  errors: {
    title: "",
    address:""
  },
  isloading: false,
  subscribed:false,
  attendDisable:false,
};

export const reducer = persistReducer(
  {
    storage,
    key: "eventos",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.EVENTO_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.EVENTO_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.EVENTO_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.EVENTO_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.EVENTO_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.EVENTO_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false
        };
      case actionTypes.EVENTO_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.images };  
      case actionTypes.EVENTO_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.EVENTO_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };

      case actionTypes.EVENTO_FRONT_INDEX_META:
        return { ...state, frontMeta: { ...state.frontMeta, ...action.frontMeta } };

      case actionTypes.EVENTO_SET_VALUE:
        return { ...state, [action.key]: action.value };
  
      case actionTypes.EVENTO_FRONT_INDEX_SUCCESS:
        return {
          ...state,
          frontData: action.frontData,
          frontMeta: { ...state.frontMeta, ...action.frontMeta }
        };
  
      default:
        return state;
    }
  }
);

export const $fetchIndex = () => ({ type: actionTypes.EVENTO_INDEX_REQUEST });
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.EVENTO_PAGESIZE_CHANGED, pageSize: pageSize };
}

export function $page(page = 1) {
  return { type: actionTypes.EVENTO_PAGE_CHANGED, page: page };
}
export function $changeConditionValue(name, value) {
  return { type: actionTypes.EVENTO_SEARCH_REQUEST, name, value };
}
export function $disable(id) {
  return { type: actionTypes.EVENTO_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.EVENTO_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.EVENTO_ACTION_REQUEST, action: "delete", id };
}
export function $changeItem(id) {
  return { type: actionTypes.EVENTO_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  return { type: actionTypes.EVENTO_NEW_ITEM_FETCH};
}
export function $saveItem(history) {
  return { type: actionTypes.EVENTO_SAVE_ITEM, history };
}
export function $updateItemImage(images) {
  return { type: actionTypes.EVENTO_UPLOAD_IMAGE, images };
}

export function $updateItemValue(name, value) {
  return { type: actionTypes.EVENTO_SET_ITEM_VALUE, name, value };
}
export const $fetchFrontIndex = () => ({ type: actionTypes.EVENTO_FRONT_INDEX_REQUEST });
export function $frontPage(page = 1) {
  return { type: actionTypes.EVENTO_FRONT_PAGE_CHANGED, page: page };
}
export function $toggleAttend(id){
  return { type:actionTypes.EVENTO_TOGGLE_ATTEND,id};
}
export function $createComment(eventoId,content){
  return { type:actionTypes.EVENTO_CREATE_COMMENT,eventoId,content};
} 
export function $appendNextReplies(comment){
  return { type:actionTypes.EVENTO_APPEND_NEXT_REPLIES, comment}
} 
export function $hideReplies(comment){
  return { type:actionTypes.EVENTO_HIDE_REPLIES, comment}
}
export function $createReply(evento_id,content,parent_id){
  return { type:actionTypes.EVENTO_CREATE_REPLY,evento_id,content,parent_id}
} 
export function $deleteComment(comment){
  return { type:actionTypes.EVENTO_DELETE_COMMENT,comment}
} 
export function $updateComment(id, content, evento_id){
  return { type:actionTypes.EVENTO_UPDATE_COMMENT,id, content, evento_id}
}
const eventsRequest = (meta, searchCondition) =>
  http({
    path: `eventos?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchEvent() {
  try {
    const evento = yield select(store => store.evento);
    const result = yield call(eventsRequest, evento.meta, evento.searchCondition);
    yield put({
      type: actionTypes.EVENTO_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
function* searchEvent({ name, value }) {
  try {
    yield put({ type: actionTypes.EVENTO_CHANGE_SEARCH_VALUE, name, value });
    const evento = yield select(store => store.evento);
    const result = yield call(eventsRequest, evento.meta, evento.searchCondition);
    yield put({
      type: actionTypes.EVENTO_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.evento.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.EVENTO_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.EVENTO_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.EVENTO_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.EVENTO_INDEX_REQUEST });
}
function* callAction({ action, id }) {
  try {
    yield call(eventActionRequest, action, id);
    const evento = yield select(store => store.evento);
    if (action === "delete") {
      yield put({ type: actionTypes.EVENTO_INDEX_REQUEST });
    } else {
      let data = evento.data;
      data.forEach(item => {
        if (item.id === id) {
          if (action === "disable") item.status = "Draft";
          else item.status = "Publish";
        }
      });
      yield put({
        type: actionTypes.EVENTO_INDEX_SUCCESS,
        data: data,
        meta: evento.meta
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
function eventActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `eventos/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `eventos/${id}/${action}` }).then(
      response => response.data
    );
  }
}
const findEvent = id =>
  http({ path: `eventos/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  const evento = yield select(store => store.evento);
  
  yield put({ type: actionTypes.EVENTO_LOADING_REQUEST });
  if (evento.data != null) {
    const filterEvents = evento.data.filter(evento => {
      return evento.id === id;
    });
    if (filterEvents.length > 0) {
      yield put({ type: actionTypes.EVENTO_SET_ITEM, item: filterEvents[0] });
      yield put({ type: actionTypes.EVENTO_UPLOAD_IMAGE, images: [] });
      return;
    }
  }
  try {
    const result = yield call(findEvent, id);
    if (result.id)
      yield put({ type: actionTypes.EVENTO_SET_ITEM, item: result });
    else yield put({ type: actionTypes.EVENTO_SET_ITEM, item: null });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
    }
  }
}
const saveEvent = evento => {
  const formData = new FormData();
  formData.append("title", evento.item.title);
  formData.append("description", evento.item.description);
  formData.append("done_date", evento.item.date + ' ' + evento.item.datetime+':00');
  formData.append("address", evento.item.address);
  formData.append("latitude", evento.item.latitude);
  formData.append("longitude", evento.item.longitude);
  if (evento.uploadImage) {
    evento.uploadImage.forEach((file, i) => {
      if(file.file)formData.append(`images[${i}]`, file.file);
      else formData.append(`image_ids[${i}]`, file.id);
    });
  }

  if (evento.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `eventos/${evento.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `eventos`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};
function* saveItem({ history }) {
  const evento = yield select(store => store.evento);
  yield put({ type: actionTypes.EVENTO_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveEvent, evento);
    if (result.evento) {
      alert("Saving success.");
      history.push("/admin/eventos");
      //yield put({type: actionTypes.EVENTO_INDEX_REQUEST});
    } else {
      if (result.errors.code) {
        yield put({
          type: actionTypes.EVENTO_SET_ITEM_ERROR,
          name: "code",
          value: result.errors.code
        });
      }
      yield put({ type: actionTypes.EVENTO_CHANGE_SAVE_STATUS, status: false });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
      alert("Saving failed.");
      yield put({ type: actionTypes.EVENTO_CHANGE_SAVE_STATUS, status: false });
    }
  }
}
function* newItemFetch(){
  const evento = yield select(store => store.evento);
  const item = {
    id: null,
    title: "",
    description: "",
    address: "",
    date:"",
    datetime:"",
    latitude:null,
    longitude:null,
    status:"Publish",
  };
  yield put({ type: actionTypes.EVENTO_SET_ITEM, item });
}
const eventsFrontRequest = (meta) =>
  http({
    path: `eventos/home?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
    })}`
  }).then(response => response.data);
function* fetchFrontEvent(){
  try {
    const evento = yield select(store => store.evento);
    const result = yield call(eventsFrontRequest, evento.frontMeta);
    yield put({
      type: actionTypes.EVENTO_FRONT_INDEX_SUCCESS,
      frontData: result.data,
      frontMeta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    yield put({ type: actionTypes.EVENTO_INDEX_FAILURE, error: e.message });
  }
}
function* changeFrontPage({ page }) {
  const frontMeta = yield select(store => store.evento.frontMeta);
  if (page < 0) {
    page = 0;
  }

  if (page > frontMeta.pageTotal) {
    page = frontMeta.pageTotal - 1;
  }
  yield put({ type: actionTypes.EVENTO_FRONT_INDEX_META, frontMeta: { page: page } });
  yield put({ type: actionTypes.EVENTO_FRONT_INDEX_REQUEST });
}
const eventToggleAttedRequest = (id)=>
  http({ path: `eventos/${id}/toggle-attend`, method: "post" }).then(
    response => response.data
  );
function* toggleAttend({id}){
  yield put({type:actionTypes.EVENTO_SET_VALUE,name:"attendDisable",value:true});
  const evento = yield select(({evento})=>evento.item);
  try{
    const result = yield call(eventToggleAttedRequest,id);
    if(evento.id == id){
      yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"participants",value:result.event.participants});
      yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"participant",value:result.event.participant});
    }
  }catch(e){

  }
  yield put({type:actionTypes.EVENTO_SET_VALUE,name:"attendDisable",value:false});
}
function* updateComments(currentComment, result){
  let comments;
  const evento = yield select(({evento})=>evento.item);
  if(currentComment){
    comments = evento.comments.map(newComment=>{
      if(currentComment.id == newComment.id){
        newComment.children = result.children;
        newComment.nextChildrenCount = result.nextChildrenCount;
      }
      return newComment;
    });
  }else{
    if(evento.comments.length == 0 ){
      comments = [...result.comments];
    }else{
      comments = result.comments.map(newComment=>{
        const oldComment = evento.comments.find(comment=>comment.id == newComment.id);    
        if(oldComment&&oldComment.children.length>0){
          newComment.children = oldComment.children;
          newComment.nextChildrenCount = newComment.nextChildrenCount - newComment.children.length;
        }
        return newComment;
      });      
    }
  }
  yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"comments",value:comments});
  if(result.commentsCount)yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"commentsCount",value:result.commentsCount});
}
const createCommentRequest = (eventoId,content)=>
  http({
    path: "evento-comments",
    method: "POST",
    data:{
      evento_id:eventoId,
      content,
    }
  }).then(response => response.data);
function* createComment({eventoId,content}){
  try{
    const result = yield call(createCommentRequest, eventoId, content);
    yield call(updateComments,null, result);
  }catch(error){
    console.log(error)
  }
}
const updateCommentRequest = (id, content)=>
  http({
    path: "evento-comments/"+id,
    method: "PUT",
    data:{
      content
    }
  }).then(response => response.data);
function* updateComment({id, content}){
  const evento = yield select(({evento})=>evento.item);
  try{
    const result = yield call(updateCommentRequest,id, content);
    const comments = evento.comments.map(comment=>{
      if(comment.children.length>0){
        const children = comment.children.map((reply)=>{
          if(reply.id == id)reply.content = content;  
          return reply;
        });
        comment.children = children;      
      }
      if(comment.id == id){        
        comment.content = content;
      }
      return comment;
    });
    yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"comments",value:comments});
  }catch(e){

  }  
}
const deleteCommentRequest = (commentId,toId)=>
  http({
    path: "evento-comments/"+commentId,
    method: "DELETE",
    data:{
      to_id:toId
    }
  }).then(response => response.data);
function* deleteComment({comment}){
  const evento = yield select(({evento})=>evento.item);
  let toId = -1; 
  if(comment.level1>0){
    if(comment.children.length){
      toId = comment.children[comment.children.length-1].id;
    }
  }
  try{
    const result = yield call(deleteCommentRequest,comment.id,toId);
    let comments;
    if(comment.level1>0){
      comments = evento.comments.map(oldComment=>{
        if(oldComment.id === comment.parent_id){
          oldComment.children = result.children;
          oldComment.nextChildrenCount = result.nextChildrenCount;
        }
        return oldComment;
      });
    }else{
      comments = result.comments.map(newComment=>{
        const oldComment = evento.comments.find(comment=>comment.id == newComment.id);    
        if(oldComment&&oldComment.children.length>0){
          newComment.children = oldComment.children;
          newComment.nextChildrenCount = newComment.nextChildrenCount - newComment.children.length;
        }
        return newComment;
      });
    }
    yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"comments",value:comments});
    yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"commentsCount",value:result.commentsCount});
  }catch(e){
    console.log(e)
  }  
}
const createReplyRequest = (eventoId,content,parent_id)=>
  http({
    path: "evento-comments",
    method: "POST",
    data:{
      evento_id:eventoId,
      parent_id,
      content
    }
  }).then(response => response.data);
function* createReply({evento_id, content, parent_id}){
  const evento = yield select(({evento})=>evento.item);
  try{
    const result = yield call(createReplyRequest, evento_id, content, parent_id);
    const comments = evento.comments.map(oldComment=>{
      if(oldComment.id === parent_id){
        oldComment.children = result.comments;
        oldComment.nextChildrenCount = result.nextChildrenCount;
      }
      return oldComment;
    });
    yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"comments",value:comments});
    yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"commentsCount",value:result.commentsCount});
  }catch(error){

  }
}
function* hideReplies({comment}){
  const evento = yield select(({evento})=>evento.item);
  if(comment.children && comment.children.length>0){
    const comments = evento.comments.map(oldComment=>{
      if(comment.id == oldComment.id){
        oldComment.nextChildrenCount = oldComment.nextChildrenCount + oldComment.children.length;
        oldComment.children = [];
      }
      return oldComment;
    });
    yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"comments",value:comments});
  }
}
const appendNextRepliesRequest = (id)=>
  http({
    path: "evento-comments?id="+id+"&type=appendNextReplies",
    method: "GET",
  }).then(response => response.data);
function* appendNextReplies({comment}){
  const evento = yield select(({evento})=>evento.item);
  try {
    const result = yield call(appendNextRepliesRequest,comment.id);
    if(result.comments && result.comments.length>0){
      const comments = evento.comments.map(oldComment=>{
        if(comment.id == oldComment.id){
          oldComment.children = [...oldComment.children, ...result.comments];
          oldComment.nextChildrenCount = oldComment.nextChildrenCount - result.comments.length;
        }
        return oldComment;
      });
      yield put({type:actionTypes.EVENTO_SET_ITEM_VALUE,name:"comments",value:comments});
    }
  }catch(error){

  }
}
export function* saga() {
  yield takeLeading(actionTypes.EVENTO_INDEX_REQUEST, fetchEvent);
  yield takeLeading(actionTypes.EVENTO_PAGE_CHANGED, changePage);
  yield takeLeading(actionTypes.EVENTO_PAGESIZE_CHANGED, changePageSize);
  yield takeLeading(actionTypes.EVENTO_SEARCH_REQUEST, searchEvent);
  yield takeLeading(actionTypes.EVENTO_ACTION_REQUEST, callAction);
  yield takeLeading(actionTypes.EVENTO_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.EVENTO_SAVE_ITEM, saveItem);
  yield takeLeading(actionTypes.EVENTO_NEW_ITEM_FETCH,newItemFetch);
  yield takeLeading(actionTypes.EVENTO_FRONT_INDEX_REQUEST, fetchFrontEvent);
  yield takeLeading(actionTypes.EVENTO_FRONT_PAGE_CHANGED, changeFrontPage);
  yield takeLeading(actionTypes.EVENTO_TOGGLE_ATTEND,toggleAttend);
  yield takeLeading(actionTypes.EVENTO_CREATE_COMMENT,createComment);
  yield takeLeading(actionTypes.EVENTO_UPDATE_COMMENT,updateComment);
  yield takeLeading(actionTypes.EVENTO_DELETE_COMMENT,deleteComment);
  yield takeLeading(actionTypes.EVENTO_CREATE_REPLY,createReply);
  yield takeLeading(actionTypes.EVENTO_HIDE_REPLIES,hideReplies);
  yield takeLeading(actionTypes.EVENTO_APPEND_NEXT_REPLIES,appendNextReplies);
}
