import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  createPost,
  updatePost,
  deletePost,
  closeEditModal,
  removePostStore,
  addNewsfeedBefore,
  addNewsfeedAfter,
  setNewsfeed,
  addCustomerPostsAfter,
  setCustomerPosts,
  setItemValue,
  addCustomerPostMediasAfter,
} from "./actions";

const initialState = {
  dropdown:false,
  newsfeed:[],
  newsfeedLastId:-1,
  newsfeedLast:false,
  suggested:0,
  savingPost:false,
  old:0,
  modalPost:false,
  suggestedPosts:[],
  suggestedPostsLastId:-1,
  suggestedPostsLast:false,
  oldNewsfeed:[],
  oldNewsfeedLastId:-1,
  oldNewsfeedLast:false,
  post:false,
  editPost:false,
  customerPosts:[],
  customerProfile:true,
  customerPostsLastId:-1,
  customerPostsLast:false,
  launch:false,
  selfRandomMedias:[],
  otherRandomMedias:[],
  selfMedias:[],
  selfMediasLastId:-1,
  selfMediasLast:false,
  openEditModal:false,
  videoPlayer:false,
  videoPlayerModalMode:false,
  videoPlayerOpenModal:false,
  videoPlayerOpenCurrentTime:0,
};
// const containsPost = (posts, post)=>{
//   posts.every(item=>item.id == post.id)
// }
const reducer = persistReducer(
  {
    storage,
    key: "post",
    blacklist:['suggested','suggestedPosts','suggestedPostsLastId','suggestedPostsLast']
  },
  handleActions(
    {
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),    
      [addNewsfeedBefore]:(state, actions) =>{
        let clonedNewsfeed = [...state.newsfeed];
        const filteredPosts = actions.payload.filter((post)=>!clonedNewsfeed.some(item=>item.id == post.id));
        clonedNewsfeed = filteredPosts.concat(clonedNewsfeed);
        return {
          ...state,
          newsfeed:clonedNewsfeed,
        }
      },
      [addNewsfeedAfter]:(state, actions) =>{
        let clonedNewsfeedAfter = [...state.newsfeed];
        const filteredPostsAfter = actions.payload.filter((post)=>!clonedNewsfeedAfter.some(item=>item.id == post.id));
        clonedNewsfeedAfter = clonedNewsfeedAfter.concat(filteredPostsAfter);
        let minId = state.newsfeedLastId;
        if(filteredPostsAfter.length>0){
          const ids = filteredPostsAfter.map(item=>item.id);
          minId = Math.min(...ids);
        }
        console.log(filteredPostsAfter.length)
        return {
          ...state,
          newsfeed:clonedNewsfeedAfter,
          newsfeedLastId:minId,
          newsfeedLast:filteredPostsAfter.length === 0?true:false
        }
      },
      [setNewsfeed]:(state, actions) =>{
        let mId = state.newsfeedLastId;
        if(actions.payload.length>0){
          const ids = actions.payload.map(item=>item.id);
          mId = Math.min(...ids);
          console.log(mId)
        }
        return {
          ...state,
          newsfeed:actions.payload,
          newsfeedLastId:mId,
          newsfeedLast:false,
          launch:true
        }
      },
      [addCustomerPostsAfter]:(state, actions) =>{
        let clonedCustomerPostsAfter = [...state.customerPosts];
        const filteredPostsAfter = actions.payload?actions.payload.filter((post)=>!clonedCustomerPostsAfter.some(item=>item.id == post.id)):[];
        clonedCustomerPostsAfter = clonedCustomerPostsAfter.concat(filteredPostsAfter);
        let minId = state.customerPostsLastId;
        if(filteredPostsAfter.length>0){
          const ids = filteredPostsAfter.map(item=>item.id);
          minId = Math.min(...ids);
        }
        return {
          ...state,
          customerPosts:clonedCustomerPostsAfter,
          customerPostsLastId:minId,
          customerPostsLast:filteredPostsAfter.length === 0?true:false
        }
      },
      [setCustomerPosts]:(state, actions) =>{
        let mId = state.customerPostsLastId;
        if(actions.payload&&actions.payload.length>0){
          const ids = actions.payload.map(item=>item.id);
          mId = Math.min(...ids);
          console.log(mId)
        }
        return {
          ...state,
          customerPosts:actions.payload?actions.payload:[],
          customerPostsLastId:mId,
          customerPostsLast:false,
        }
      },
      [setItemValue]:(state, {payload:{name,value}})=>({
        ...state,
        [name]:value
      }),
      [addCustomerPostMediasAfter]:(state, actions) =>{
        let clonedselfMediasAfter = [...state.selfMedias];
        let filteredMediasAfter = actions.payload.filter((post)=>!clonedselfMediasAfter.some(item=>item.id == post.id));
        if(clonedselfMediasAfter.length == 0)filteredMediasAfter = [...actions.payload];
        clonedselfMediasAfter = clonedselfMediasAfter.concat(filteredMediasAfter);
        let minId = state.customerPostsLastId;
        if(filteredMediasAfter.length>0){
          const ids = filteredMediasAfter.map(item=>item.id);
          minId = Math.min(...ids);
        }
        return {
          ...state,
          selfMedias:clonedselfMediasAfter,
          selfMediasLastId:minId,
          selfMediasLast:filteredMediasAfter.length === 0?true:false
        }
      },
      [removePostStore]:(state, actions) =>{
        const filteredCustomerPosts = state.customerPosts.filter((post)=>post.id!=actions.payload);
        return {
          ...state,
          customerPosts:filteredCustomerPosts,
        }
      },
      [closeEditModal]:(state,actions) =>({
        ...state,
        editPost:false
      })
    },
    initialState
  )
);
export default reducer;
