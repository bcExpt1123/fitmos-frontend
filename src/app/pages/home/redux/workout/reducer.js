import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  initialModalBlock,
  nextModalBlock,
  previousModalBlock,
  convertVideo,
  convertIntroduction,
  convertContent,
  setVideo,
  alternateVideo,
} from "./actions";

const initialState = {
  step:1,
  view:"content",
  originalVideo:false,
  video:false,
  timer:false,
};
const reducer = persistReducer(
  {
    storage,
    key: "workout",
    whitelist:['workouts']
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),
      [initialModalBlock]:(state) =>({
        ...state,
        step:1
      }),
      [nextModalBlock]:(state) =>({
        ...state,
        step:state.step + 1
      }),
      [previousModalBlock]:(state) =>({
        ...state,
        step:state.step - 1
      }),
      [convertVideo]:(state) =>({
        ...state,
        view:"video"
      }),
      [convertIntroduction]:(state) =>({
        ...state,
        view:"instruction"
      }),
      [convertContent]:(state) =>({
        ...state,
        view:"content"
      }),
      [setVideo]:(state,actions) =>({
        ...state,
        video:actions.payload,
        originalVideo:actions.payload
      }),
      [alternateVideo]:(state,actions) =>{{
        const changedVideo = {...state.video[actions.payload]};
        let changeVideo = {...state.video,...changedVideo};
        changeVideo[actions.payload] = {
          name:state.video.name,
          id:state.video.id,
          instruction:state.video.instruction,
          url:state.video.url,
          time:state.video.time,
          level:state.video.level
        }
        return {
          ...state,
          video:changeVideo,
        }
      }}
    },
    initialState
  )
);
export default reducer;
