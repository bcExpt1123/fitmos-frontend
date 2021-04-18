import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  confirmAlternate,setVideo, pulling, setPublic
} from "./actions";
import {
  replaceWithShortcode
} from "../done/actions";
import { findUserDetails } from "../../redux/auth/actions";
import { findFriends } from "../../redux/people/actions";
import { findNewsfeed, refreshNewsfeed, syncPosts, refreshCustomerPosts, refreshSuggestedPosts, refreshOldNewsfeed } from "../../redux/post/actions";
import { searchNotifications, findFollows, follow } from "../../redux/notification/actions";
import { http } from "../../services/api";

const confirmAlternateRequest = ({shortcode_id,alternate_id})=>
  http({
    path: "customers/alternate-shortcode",
    method: "POST",
    data: {
      shortcode_id,
      alternate_id
    }
  }).then(response => response.data.voucher);

function* onConfirmAlternate(){
  const originalVideo = yield select(({workout}) => workout.originalVideo);
  const video = yield select(({workout}) => workout.video);
  try {
    const result = yield call(confirmAlternateRequest, {
      shortcode_id:originalVideo.original_id,
      alternate_id:video.id,
    });
    yield put(setVideo(video));
    yield put(replaceWithShortcode({shortcode:video}));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
// const init = async ()=> {
//   const config = [
//     {
//       appId: process.env.REACT_APP_CONNECTY_CUBE_APP_ID,
//       authKey: process.env.REACT_APP_CONNECTY_CUBE_AUTH_KEY,
//       authSecret: process.env.REACT_APP_CONNECTY_CUBE_AUTH_SECRET,
//     },
//     { chat: {
//       streamManagement: {
//         enable: true
//       }
//     },
//       debug: {
//         mode: 1
//       } 
//     }
//   ];    
//   await ConnectyCube.init(...config)
// }
// const signIn = async (params)=> {
//   const session = await ConnectyCube.createSession(params)
//   console.log(session)
//   // this.setUserSession(session)
//   const token = ConnectyCube.service.sdkInstance.session.token;
//   await ConnectyCube.chat.connect({ userId:session.id, password:token })
// }

// const signUp = async (params)=> {
//   await ConnectyCube.createSession()
//   await ConnectyCube.users.signup(params)
//   return this.signIn(params)
// }
function* onPulling({payload:{id}}){
  let login = true;
  while (login) {
    const currentUser = yield select(({auth}) => auth.currentUser);
    let customer;
    if(currentUser && currentUser.customer) {
      customer = currentUser.customer;
      if(customer.id != id){
        login = false;
        yield put(pulling({id:customer.id}));
        break;
      }
    }
    else {
      login = false;
      break;
    }
    try {
      const newsfeed = yield select(({post})=>post.newsfeed);
      const newsfeedPostIds = newsfeed.map(item=>item.id);
      const newsfeedTopVisible = yield select(({post})=>post.newsfeedTopVisible);
      const customerPosts = yield select(({post})=>post.customerPosts);
      const customerPostIds = customerPosts.map(item=>item.id);
      const suggestedPosts = yield select(({post})=>post.suggestedPosts);
      const suggestedPostIds = suggestedPosts.map(item=>item.id);
      const suggestedPostsTopVisible = yield select(({post})=>post.suggestedPostsTopVisible);
      const oldNewsfeed = yield select(({post})=>post.oldNewsfeed);
      const oldNewsfeedIds = oldNewsfeed.map(item=>item.id);
      const oldNewsfeedTopVisible = yield select(({post})=>post.oldNewsfeedTopVisible);
      const mergedPosts = [...newsfeed, ...customerPosts,...suggestedPosts, ...oldNewsfeed];
      let ids;  
      if(mergedPosts.length == 0) ids = [{id:-1}];
      else{
        ids = mergedPosts.map((post)=>{
          const d = new Date(post.updated_at +" GMT-0500");
          return {
            id:post.id,
            time:d.getTime()
          }
        })
      }
      /** newsfeed */
      let newsfeedId = -1;
      if( newsfeedTopVisible && newsfeedPostIds.length>0)newsfeedId = newsfeedPostIds[0];
      /** suggestedPosts */
      let suggestedPostsId = -1;
      if( suggestedPostsTopVisible && suggestedPostIds.length>0)suggestedPostsId = suggestedPostIds[0];
      /** old newsfeed */
      let oldNewsfeedId = -1;
      if( oldNewsfeedTopVisible && oldNewsfeedIds.length>0)oldNewsfeedId = oldNewsfeedIds[0];
      /** customer posts */
      let customerId = -1;
      let customerPostTopId = -1;
      const customerPostsTopVisible = yield select(({post})=>post.customerPostsTopVisible);
      if(customerPostsTopVisible){
        const username = yield select(({people})=>people.username);
        if(username.type == "customer"){
          customerId = username.id;
          if(customerPostIds.length>0)customerPostTopId = customerPostIds[0];
        }else{
          console.error("people username error", username)
        }
      }
      // const d = new Date(customer.updated_at+" GMT-0500");
      const customerTime = customer.updated_at;
      const publicProfile = yield select(({workout})=>workout.publicProfile);
      /** follow requests */
      let followsIds = [];
      const follows = yield select(({notification}) => notification.follows);
      if(follows.length>0){
        followsIds = follows.map(follow=>follow.id);
      }
      const notificationLastId = yield select(({notification})=>notification.notificationLastId);
      const data = {ids, newsfeedId, oldNewsfeedId, suggestedPostsId, customerId, customerPostTopId, customerTime, publicProfile, followsIds, notificationLastId};
      const response = yield call(() => fetch(process.env.REACT_APP_PULL_API_URL+id,{
        method:"POST",
        body:JSON.stringify(data),
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
      }))
      const pull = yield call(()=>response.json());
      /** newsfeed */
      if( pull.newsfeed ){
        yield put(refreshNewsfeed());
      }
      /** old newsfeed */
      if( pull.oldNewsfeed ){
        yield put(refreshOldNewsfeed());
      }
      /** suggestedPosts */
      if( pull.suggestedPosts ){
        yield put(refreshSuggestedPosts());
      }
      /** old newsfeed */
      if( pull.customerPosts ){
        yield put(refreshCustomerPosts());
      }
      if( pull.customer ){
        yield put(findUserDetails());
      }
      if( pull.publicProfile ){
        // const publicProfile = yield select(({workout})=>workout.publicProfile);
        // if(pull.publicProfile !== publicProfile){
          yield put(findFriends());
          yield put(setPublic(pull.publicProfile));
        // }
      }
      const newsfeedStart = yield select(({post})=>post.launch);
      if( !newsfeedStart && newsfeed.length === 0 ){
        const suggested = yield select(({post})=>post.suggested);
        if(suggested == 0)yield put(findNewsfeed());
      }else if( pull.newsfeed ){
        // yield put(appendNewsfeedBefore(pull.newsfeed));
        // send post ids
      }
      if( pull.notification ){
        yield put(searchNotifications(pull.notification));
      }
      if( pull.follow ){
        yield put(findFollows());
      }
      if( pull.posts && pull.posts.length>0){
        const mergedPosts = [...newsfeed, ...customerPosts,...suggestedPosts, oldNewsfeed];
        const diffPosts = mergedPosts.filter(postItem=>pull.posts.some(post=>{
            const d = new Date(postItem.updated_at +" GMT-0500");
            return postItem.id == post.id && d.getTime()!=post.updated_at
          }));
        if(diffPosts.length>0){
          const diffIds = diffPosts.map(post=>post.id);
          yield put(syncPosts(diffIds));
        }
      }
      if(process.env.APP_ENV !== "production")yield delay(5000);
    } catch (e) {
      console.log(e);
      // yield put({ type: FETCH_JOKE_FAILURE, message: e.message })
      const currentUser = yield select(({auth}) => auth.currentUser);
      if(currentUser && currentUser.customer) {
        if(currentUser.customer.id != id){
          login = false;
          yield put(pulling({id:customer.id}));
          break;
        }
      }else{
        login = false;
      }
    }
  }  
}
export default function* rootSaga() {
  yield takeLeading(confirmAlternate,onConfirmAlternate);
  yield takeLeading(pulling,onPulling);
}
