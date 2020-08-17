import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setWorkout,
  putWorkout,
  initialBlock,
  nextBlock,
  previousBlock,
  setSurvey,
  startProfileImageUploading,
  endProfileImageUploading,
} from "./actions";

const initialState = {
  workoutCount:0,
  fromWorkout:undefined,
  fromWorkoutImage:undefined,
  toWorkout:undefined,
  toWorkoutImage:undefined,
  workouts:undefined,
  step:0,
  survey:null,
  tagLine:null,
  isProfileImageLoading:false,
};
const reducer = persistReducer(
  {
    storage,
    key: "done",
    whitelist:['workouts']
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
      [putWorkout]: (state, { payload: { workouts,tagLine } }) => ({
        ...state,
        workouts,
        tagLine
      }),
      [initialBlock]:(state) =>({
        ...state,
        step:0
      }),
      [nextBlock]:(state) =>({
        ...state,
        step:state.step + 1
      }),
      [previousBlock]:(state) =>({
        ...state,
        step:state.step - 1
      }),
      [setSurvey]:(state,{ payload:{survey}})=>({
        ...state,
        survey
      }),
      [startProfileImageUploading]:(state) =>({
        ...state,
        isProfileImageLoading:true,
      }),
      [endProfileImageUploading]:(state) =>({
        ...state,
        isProfileImageLoading:false,
      }),
    },
    initialState
  )
);
export default reducer;
