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
  confirmModalNo,
  confirmModalYes,
  setPublic,
  goCreateComment
} from "./actions";

const initialState = {
  step:1,
  view:"content",
  originalVideo:false,
  video:false,
  timer:false,
  publicProfile:false,
  modalVideo:false,
  slug:false,
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
        if(actions.payload === 'alternate_a'){
          if(state.video.alternate_b){
            changeVideo['alternate_b'] = {
              name:state.video.name,
              id:state.video.id,
              instruction:state.video.instruction,
              url:state.video.url,
              time:state.video.time,
              level:state.video.level,
              multipler:state.video.multipler,
              original_multipler:state.video.original_multipler,
            }
            changeVideo['alternate_a'] = {
              name:state.video.alternate_b.name,
              id:state.video.alternate_b.id,
              instruction:state.video.alternate_b.instruction,
              url:state.video.alternate_b.url,
              time:state.video.alternate_b.time,
              level:state.video.alternate_b.level,
              multipler:state.video.alternate_b.multipler,
              original_multipler:state.video.alternate_b.original_multipler,
            }
            changeVideo.multipler_b = state.video.multipler;
            changeVideo.multipler_a = state.video.multipler_b;
          }else{
            changeVideo['alternate_a'] = {
              name:state.video.name,
              id:state.video.id,
              instruction:state.video.instruction,
              url:state.video.url,
              time:state.video.time,
              level:state.video.level,
              multipler:state.video.multipler,
              original_multipler:state.video.original_multipler,
            }
            changeVideo.multipler_a = state.video.multipler;
          }
          changeVideo.multipler = state.video.multipler_a;
          changeVideo.original_multipler = state.video.multipler_a;
        }else{
          if(state.video.alternate_a){
            changeVideo['alternate_a'] = {
              name:state.video.name,
              id:state.video.id,
              instruction:state.video.instruction,
              url:state.video.url,
              time:state.video.time,
              level:state.video.level,
              multipler:state.video.multipler,
              original_multipler:state.video.original_multipler,
            }
            changeVideo['alternate_b'] = {
              name:state.video.alternate_a.name,
              id:state.video.alternate_a.id,
              instruction:state.video.alternate_a.instruction,
              url:state.video.alternate_a.url,
              time:state.video.alternate_a.time,
              level:state.video.alternate_a.level,
              multipler:state.video.alternate_a.multipler,
              original_multipler:state.video.alternate_a.original_multipler,
            }
            changeVideo.multipler_a = state.video.multipler;  
            changeVideo.multipler_b = state.video.multipler_a;
          }else{
            changeVideo['alternate_a'] = {
              name:state.video.name,
              id:state.video.id,
              instruction:state.video.instruction,
              url:state.video.url,
              time:state.video.time,
              level:state.video.level,
              multipler:state.video.multipler,
              original_multipler:state.video.original_multipler,
            }
            changeVideo.multipler_b = state.video.multipler;
          }
          changeVideo.multipler = state.video.multipler_b;
          changeVideo.original_multipler = state.video.multipler_b;
        }
        return {
          ...state,
          video:changeVideo,
        }
      }},
      [confirmModalNo]:(state,actions) =>({
        ...state,
        modalVideo:false
      }),
      [confirmModalYes]:(state,actions) =>({
        ...state,
        modalVideo:true
      }),
      [setPublic]:(state, actions) =>({
        ...state,
        publicProfile:actions.payload
      }),
      [goCreateComment]:(state,actions) =>({
        ...state,
        slug:actions.payload.slug,
        comment:actions.payload.comment,
        view:"comment"
      }),
    },
    initialState
  )
);
export default reducer;
