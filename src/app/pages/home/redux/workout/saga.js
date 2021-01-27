import { call, takeLeading, select,put, delay, race } from "redux-saga/effects";
import {
  confirmAlternate,setVideo, pulling, setPublic
} from "./actions";
import {
  replaceWithShortcode
} from "../done/actions";
import { findUserDetails } from "../../redux/auth/actions";
import { findFriends } from "../../redux/people/actions";
import { findNewsfeed, appendNewsfeedBefore } from "../../redux/post/actions";
import { searchNotifications, findFollows } from "../../redux/notification/actions";
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
function* onPulling({payload:{id}}){
  while (true) {
    try {
      const response = yield call(() => fetch(process.env.REACT_APP_PULL_API_URL+id,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
      }))
      const pull = yield call(()=>response.json());
      if( pull.customer ){
        const customer = yield select(({auth}) => auth.currentUser.customer);
        const d = new Date(customer.updated_at);
        console.log(d.getTime(), pull.customer)
        if(pull.customer !=d.getTime()){
          yield put(findUserDetails());
        }
      }
      if( pull.publicProfile ){
        const publicProfile = yield select(({workout})=>workout.publicProfile);
        if(pull.publicProfile !== publicProfile){
          yield put(findFriends());
          yield put(setPublic(pull.publicProfile));
        }
      }
      const newsfeedStart = yield select(({post})=>post.launch);
      const newsfeedPosts = yield select(({post})=>post.newsfeed);
      if( !newsfeedStart && newsfeedPosts.length === 0 ){
        yield put(findNewsfeed());
      }else if( pull.newsfeed ){
        yield put(appendNewsfeedBefore(pull.newsfeed));
        // send post ids
      }
      if( pull.notification ){
        yield put(searchNotifications(pull.notification));
      }
      if( pull.follow ){
        yield put(findFollows(pull.follow));
      }
      if(process.env.APP_ENV !== "production")yield delay(10000);
      else yield delay(10000);
    } catch (e) {
      console.log(e);
      // yield put({ type: FETCH_JOKE_FAILURE, message: e.message })
      yield delay(10000);
    }
  }  
}
export default function* rootSaga() {
  yield takeLeading(confirmAlternate,onConfirmAlternate);
  yield takeLeading(pulling,onPulling);
}
