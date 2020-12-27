import { call, takeLeading, select,put } from "redux-saga/effects";
import {
  confirmAlternate,setVideo
} from "./actions";
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
      shortcode_id:originalVideo.id,
      alternate_id:video.id,
    });
    yield put(setVideo(video));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
export default function* rootSaga() {
  yield takeLeading(confirmAlternate,onConfirmAlternate);
}
