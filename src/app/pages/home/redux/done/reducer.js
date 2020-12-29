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
  setShopMenu,
  setRunning,
  stopRunning,
  setTimer,
  removeTimer,
  replaceWithShortcode
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
  shopMenu:null,
  isRunning:false,
  timer:false,
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
      [setShopMenu]:(state,{ payload:{shopMenu}})=>({
        ...state,
        shopMenu
      }),
      [setRunning]:(state)=>({
        ...state,
        isRunning:true,
      }),
      [stopRunning]:(state)=>({
        ...state,
        isRunning:false,
      }),
      [setTimer]:(state)=>({
        ...state,
        timer:true,
      }),
      [removeTimer]:(state)=>({
        ...state,
        timer:false,
      }),
      [replaceWithShortcode]:(state, {payload:{shortcode}})=>{
        const blocks = state.workouts.current.blocks.map((block)=>{
          if(block.content && Array.isArray(block.content)){
            block.content = block.content.map((line)=>{
              if(line.video && line.video.id && line.video.original_id == shortcode.original_id){
                if(typeof line.line.before_content == "object"){
                  line.before_content = line.line.before_content.content.replace("@@multipler@@",Math.round(shortcode.multipler * line.line.before_content.multipler));
                }
                line.video = shortcode;
                if(Array.isArray(line.line.after_content)){
                  line.after_content = line.line.after_content.content.replace("@@multipler@@",Math.round(shortcode.multipler * line.line.before_content.multipler));
                }
              }
              return line;
            })
          }
          return block;
        });
        const workouts = {...state.workouts};
        workouts.current.blocks = blocks;
        return {
          ...state,workouts
        }
      }
    },
    initialState
  )
);
export default reducer;
