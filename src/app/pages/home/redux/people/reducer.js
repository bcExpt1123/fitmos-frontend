import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  setPeople,
  setSearchResult,
  setItemValue,
  appendCustomers,
  appendCompanies,
  appendPosts,
} from "./actions";

const initialState = {
  customer:false,
  people:[],//tag following, mentions
  privateProfiles:[],// private profiles except unfollow 
  // followers:[],
  popupCustomers:[],
  searchValue:"",
  searchResult:{
    people:[],
    shops:[],
    posts:[],
  },
  searchPageResults:{
    people:[],
    shops:[],
    posts:[],
  },
  searchCustomers:[],
  customerLastId:-1,
  customerLast:false,
  searchCompanies:[],
  companyLastId:-1,
  companyLast:false,
  searchPosts:[],
  postLastId:-1,
  postLast:false,
  username:"username",
};
const reducer = persistReducer(
  {
    storage,
    key: "people",
    blacklist:['customer','username','popupCustomers','searchResult','searchPageResults'],
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
      [setSearchResult]: (state, { payload: { searchResult } }) => ({
        ...state,
        searchResult
      }),
      [setItemValue]:(state, {payload:{name,value}})=>({
        ...state,
        [name]:value
      }),
      [appendCustomers]:(state,{payload})=>{
        let clonedCustomers = [...state.searchCustomers];
        let filteredCustomers = payload.filter((post)=>!clonedCustomers.every(item=>item.id == post.id));
        if(clonedCustomers.length== 0 )filteredCustomers = [...payload];
        clonedCustomers = clonedCustomers.concat(filteredCustomers);
        let minId = state.customerLastId;
        if(filteredCustomers.length>0){
          const ids = filteredCustomers.map(item=>item.id);
          minId = Math.min(...ids);
        }
        return {
          ...state,
          searchCustomers:clonedCustomers,
          customerLastId:minId,
          customerLast:filteredCustomers.length === 0?true:false
        }
      },
      [appendCompanies]:(state,{payload})=>{
        let clonedCompanies = [...state.searchCompanies];
        let filteredCompanies = payload.filter((post)=>!clonedCompanies.every(item=>item.id == post.id));
        if(clonedCompanies.length== 0 )filteredCompanies = [...payload];
        clonedCompanies = clonedCompanies.concat(filteredCompanies);
        let minId = state.companyLastId;
        if(filteredCompanies.length>0){
          const ids = filteredCompanies.map(item=>item.id);
          minId = Math.min(...ids);
        }
        return {
          ...state,
          searchCompanies:clonedCompanies,
          companyLastId:minId,
          companyLast:filteredCompanies.length === 0?true:false
        }
      },
      [appendPosts]:(state,{payload})=>{
        let clonedPosts = [...state.searchPosts];
        let filteredPosts = payload.filter((post)=>!clonedPosts.every(item=>item.id == post.id));
        if(clonedPosts.length== 0 )filteredPosts = [...payload];
        clonedPosts = clonedPosts.concat(filteredPosts);
        let minId = state.postLastId;
        if(filteredPosts.length>0){
          const ids = filteredPosts.map(item=>item.id);
          minId = Math.min(...ids);
        }
        return {
          ...state,
          searchPosts:clonedPosts,
          postLastId:minId,
          postLast:filteredPosts.length === 0?true:false
        }
      },
    },
    initialState
  )
);
export default reducer;
