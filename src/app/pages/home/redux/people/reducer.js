import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setPeople
} from "./actions";

const initialState = {
  people:[],
  followers:[],
};
const reducer = persistReducer(
  {
    storage,
    key: "people",
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setPeople]: (state, { payload: { people } }) => ({
        ...state,
        people
      }),
    },
    initialState
  )
);
export default reducer;
