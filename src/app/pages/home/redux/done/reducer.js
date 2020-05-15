import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setWorkout,
} from "./actions";

const initialState = {
  workoutCount:0,
  fromWorkout:undefined,
  fromWorkoutImage:undefined,
  toWorkout:undefined,
  toWorkoutImage:undefined,
};
const reducer = persistReducer(
  {
    storage,
    key: "done"
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [setWorkout]: (state, { payload: { workoutCount,fromWorkout,fromWorkoutImage,toWorkout,toWorkoutImage } }) => ({
        ...state,
        fromWorkout,
        fromWorkoutImage,
        toWorkout,
        toWorkoutImage,
        workoutCount
      }),
    },
    initialState
  )
);
export default reducer;
