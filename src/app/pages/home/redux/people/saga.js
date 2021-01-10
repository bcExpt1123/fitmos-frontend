import { call, takeLeading, put } from "redux-saga/effects";
import {
  findFriends,
  setPeople
} from "./actions";
import { http } from "../../services/api";

const getFriends = (date) =>{
  return   http({
    path: "customers/people",
    method: "POST",
    data: {
      date
    }
    }).then(response => response.data);        
}

function* onFindFriends(){
  try {
    const { people } = yield call(getFriends);
    yield put(setPeople({people}));
  } catch (error) {
    // yield put(trackError(error));
  }
}

export default function* rootSaga() {
  yield takeLeading(findFriends,onFindFriends);
}
