import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setItemValue,
  appendNotifications,
} from "./actions";

const initialState = {
  followDisabled:false,
  muteDisabled:false,
  blockDisabled:false,
  follows:[],//notification
  followLastId:-1,
  notifications:[],
  notificationLastId:-1,
  notificationViewLastId:0,
  notificationLast:false,
  followings:[],
  followingsLastPageNumber:0,
  followingsLast:false,
  followers:[],
  followersLastPageNumber:0,
  followersLast:false,
  followCustomerId:false,
};
const reducer = persistReducer(
  {
    storage,
    key: "notifications",
    blacklist:[],
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setItemValue]:(state, {payload:{name,value}})=>({
        ...state,
        [name]:value
      }),
    },
    initialState
  )
);
export default reducer;
