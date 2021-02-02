import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setItemValue,
  appendNotifications,
} from "./actions";

const initialState = {
  followDisabled:false,
  follows:[],
  followLastId:-1,
  notifications:[],
  notificationLastId:-1,
  notificationLast:false,
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
