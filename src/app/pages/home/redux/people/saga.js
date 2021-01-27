import { call, takeLeading,takeLatest, put, select } from "redux-saga/effects";
import {
  findFriends,
  setPeople,
  searchAll,
  setSearchResult,
  setItemValue,
  searchCustomers,
  appendCustomers,
  searchCompanies,
  appendCompanies,
  searchPosts,
  appendPosts,
  findCustomer,
  findUsername
} from "./actions";
import { http } from "../../services/api";

const getFriends = (date) =>{
  return   http({
    path: "customers/people",
    method: "POST",
    data: {
      date
    }
    }).then(response => response.data);        
}

function* onFindFriends(){
  try {
    const { people } = yield call(getFriends);
    yield put(setPeople({people}));
  } catch (error) {
    // yield put(trackError(error));
  }
}

function searchAllRequest(search){
  return   http({
    path: "search/all?search="+search,
    method: "GET",
    }).then(response => response.data);        
}
function* onSearchAll({payload}){
  yield put(setItemValue({name:'searchValue',value:payload}));
  try {
    const { searchResult } = yield call(searchAllRequest,payload);
    yield put(setSearchResult({searchResult}));
  } catch (error) {

  }
}
const searchCustomersRequest = (id,search)=>
  http({
    path: "search/customers?id="+id+"&search="+search,
    method: "GET"
  }).then(response => response.data);
function* onSearchCustomers({payload}){
  if(payload){
    yield put(setItemValue({name:'searchValue',value:payload}));
    yield put(setItemValue({name:'searchCustomers',value:[]}));
    yield put(setItemValue({name:'customerLastId',value:-1}));
  }
  const id = yield select(({people})=>people.customerLastId);
  const search = yield select(({people})=>people.searchValue);
  try {
    const result = yield call(searchCustomersRequest, id,search);
    yield put(appendCustomers(result.customers));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const searchCompaniesRequest = (id,search)=>
  http({
    path: "search/companies?id="+id+"&search="+search,
    method: "GET"
  }).then(response => response.data);
function* onSearchCompanies({payload}){
  if(payload){
    yield put(setItemValue({name:'searchValue',value:payload}));
    yield put(setItemValue({name:'searchCompanies',value:[]}));
    yield put(setItemValue({name:'companyLastId',value:-1}));
  }
  const id = yield select(({people})=>people.companyLastId);
  const search = yield select(({people})=>people.searchValue);
  try {
    const result = yield call(searchCompaniesRequest, id,search);
    yield put(appendCompanies(result.companies));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const searchPostsRequest = (id,search)=>
  http({
    path: "search/posts?id="+id+"&search="+search,
    method: "GET"
  }).then(response => response.data);
function* onSearchPosts({payload}){
  if(payload){
    yield put(setItemValue({name:'searchValue',value:payload}));
    yield put(setItemValue({name:'searchPosts',value:[]}));
    yield put(setItemValue({name:'postLastId',value:-1}));
  }
  const id = yield select(({people})=>people.postLastId);
  const search = yield select(({people})=>people.searchValue);
  try {
    const result = yield call(searchPostsRequest, id, search);
    yield put(appendPosts(result.posts));
  } catch (error) {
    console.log(error);
    //yield put(validateVoucherFailed({ token }));
  }  
}
const findCustomerRequest = (id)=>
  http({
    path: "customers/"+id+"/profile",
    method: "GET"
  }).then(response => response.data);
function* onFindCustomer({payload}){
  try{
    const result = yield call(findCustomerRequest, payload);
    yield put(setItemValue({name:"customer",value:result}));
  } catch (error){

  }
}
const findUsernameRequest = (username)=>
  http({
    path: "search/username?u="+username,
    method: "GET"
  }).then(response => response.data);
function* onFindUsername({payload}){
  try{
    const result = yield call(findUsernameRequest, payload);
    if(result.id)yield put(setItemValue({name:"username",value:result}));
    else yield put(setItemValue({name:"username",value:false}));
  } catch (error){

  }
}
export default function* rootSaga() {
  yield takeLeading(findFriends,onFindFriends);
  yield takeLatest(searchAll,onSearchAll);
  yield takeLeading(searchCustomers,onSearchCustomers);
  yield takeLeading(searchCompanies,onSearchCompanies);
  yield takeLeading(searchPosts,onSearchPosts);
  yield takeLeading(findCustomer, onFindCustomer);
  yield takeLeading(findUsername, onFindUsername);
}