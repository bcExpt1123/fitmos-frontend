import { persistReducer } from "redux-persist";
import { put, call, takeLatest,select, takeLeading } from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import { INDEX_PAGE_SIZE_DEFAULT, INDEX_PAGE_SIZE_OPTIONS } from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import { logOut } from "../../app/pages/home/redux/auth/actions";
import { setShopMenu } from "../../app/pages/home/redux/done/actions";
export const actionTypes = {
  COMPANY_INDEX_REQUEST: "COMPANY_INDEX_REQUEST",
  COUNTRY_INDEX_REQUEST: "COUNTRY_INDEX_REQUEST",
  COMPANY_INDEX_SUCCESS: "COMPANY_INDEX_SUCCESS",
  COMPANY_INDEX_FAILURE: "COMPANY_INDEX_FAILURE",
  COMPANY_LOADING_REQUEST: "COMPANY_LOADING_REQUEST",
  COMPANY_SEARCH_REQUEST: "COMPANY_SEARCH_REQUEST",
  COMPANY_CHANGE_SEARCH_VALUE: "COMPANY_CHANGE_SEARCH_VALUE",
  COMPANY_ACTION_REQUEST: "COMPANY_ACTION_REQUEST",
  COMPANY_CHANGE_ITEM: "COMPANY_CHANGE_ITEM",
  COMPANY_UPLOAD_IMAGE: "COMPANY_UPLOAD_IMAGE",
  COMPANY_SAVE_ITEM: "COMPANY_SAVE_ITEM",
  COMPANY_SET_ITEM: "COMPANY_SET_ITEM",
  COMPANY_SET_VALUE: "COMPANY_SET_VALUE",
  COMPANY_SET_ITEM_VALUE: "COMPANY_SET_ITEM_VALUE",
  COMPANY_CHANGE_SAVE_STATUS: "COMPANY_CHANGE_SAVE_STATUS",
  COMPANY_SET_ITEM_ERROR: "COMPANY_SET_ITEM_ERROR",
  COMPANY_FIND_PUBLISHED: "COMPANY_FIND_PUBLISHED",
  COMPANY_UPDATE_RESULT: "COMPANY_UPDATE_RESULT",
  COMPANY_UPDATE_RESULT_ACTION: "COMPANY_UPDATE_RESULT_ACTION",
  COMPANY_RESET_PUBLISHED: "COMPANY_RESET_PUBLISHED",
  COMPANY_SET_COUNTRY:"COMPANY_SET_COUNTRY",////////////////////
  //for pagination
  COMPANY_INDEX_META: "COMPANY_INDEX_META",
  COMPANY_PAGE_CHANGED: "COMPANY_PAGE_CHANGED",
  COMPANY_PAGESIZE_CHANGED: "COMPANY_PAGESIZE_CHANGED",
  PRODUCT_FETCH_REQUEST:  "PRODUCT_FETCH_REQUEST",
  SHOW_COMPANY_DETAIL:  "SHOW_COMPANY_DETAIL",
  COUNTRY_FETCH_DATA: "COUNTRY_FETCH_DATA",
  COMPANY_EDIT_DATA: "COMPANY_EDIT_DATA",
  //for front page
  COMPANY_FRONT_INDEX_REQUEST:"COMPANY_FRONT_INDEX_REQUEST",
  COMPANY_FRONT_INDEX_SUCCESS: "COMPANY_FRONT_INDEX_SUCCESS",
  COMPANY_FRONT_INDEX_META: "COMPANY_FRONT_INDEX_META",
  COMPANY_FRONT_PAGE_CHANGED: "COMPANY_FRONT_PAGE_CHANGED",

};
export const selectors = {};

const initialState = {
  data: null,
  meta: {
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    total: 0
  },
  frontData:[],
  frontMeta: {
    page: 1,
    pageSize: 9,
    pageTotal: 1,
    total: 0
  },
  item: {
    image:"",
  },
  country:[],
  published: [],
  results: {},
  workouts: null, //recent workouts on customer dashboard
  updatedItem: null,
  action: "",
  searchCondition: {
    search: ""
  },
  uploadImage: null,
  errors: {
    title: "",
    description: ""
  },
  isloading: false
};
export const reducer = persistReducer(
  {
    storage,
    key: "company",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.COUNTRY_FETCH_DATA:
        return { ...state  ,country:action.data};
      case actionTypes.COMPANY_EDIT_DATA:
        return { ...state  ,item:action.data};
      case actionTypes.COMPANY_SET_COUNTRY:
        return { ...state  ,country:action.value};
      case actionTypes.COMPANY_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta } };

      case actionTypes.COMPANY_INDEX_SUCCESS:
        return {
          ...state,
          data: action.data,
          meta: { ...state.meta, ...action.meta }
        };

      case actionTypes.COMPANY_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.COMPANY_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.COMPANY_UPLOAD_IMAGE:
        return { ...state, uploadImage: action.image };
      case actionTypes.COMPANY_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.COMPANY_SET_VALUE:
        return { ...state, [action.key]: action.value };
      case actionTypes.COMPANY_SET_ITEM:
        return {
          ...state,
          item: action.item,
          updatedItem: action.item,
          isloading: false,
          isSaving: false,
          uploadImage: null
        };
      case actionTypes.COMPANY_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.COMPANY_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.COMPANY_UPDATE_RESULT:
        const clonedPublished = [...state.published];
        const index = clonedPublished.findIndex(item => item.id === action.id);
        if (index > -1) {
          clonedPublished[index].result = action.repetition;
        }
        return { ...state, published: clonedPublished };
      case actionTypes.COMPANY_FRONT_INDEX_SUCCESS:
        return {
          ...state,
          frontData: [...state.frontData,...action.frontData],
          frontMeta: { ...state.frontMeta, ...action.frontMeta }
        };
      case actionTypes.COMPANY_FRONT_INDEX_META:
        return { ...state, frontMeta: { ...state.frontMeta, ...action.frontMeta } };

      default:
        return state;
    }
  }
);
export const $fetchIndexCompanies = () => ({
  type: actionTypes.COMPANY_INDEX_REQUEST
});
export const $fetchCountries = () => ({
  type: actionTypes.COUNTRY_INDEX_REQUEST
});
export function $changeConditionValue(name, value) {
  return { type: actionTypes.COMPANY_SEARCH_REQUEST, name, value };
}
// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }
  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.COMPANY_PAGESIZE_CHANGED, pageSize: pageSize };
}
export function $page(page = 1) {
  return { type: actionTypes.COMPANY_PAGE_CHANGED, page: page };
}
export function $saveItem(history) {
  return { type: actionTypes.COMPANY_SAVE_ITEM, history };
}
export function $updateItemImage(image) {
  return { type: actionTypes.COMPANY_UPLOAD_IMAGE, image };
}
export function $setNewItem() {
  const item = { id: null, name: "", phone: "", mail: "", image: "",date:"",description:"",all:"",mobile_phone:"", website_url:"",address:"",facebook:"", instagram:"", twitter:"", horario:"" };
  return { type: actionTypes.COMPANY_SET_ITEM, item};
}
export function $changeItem(id) {
  return { type: actionTypes.COMPANY_CHANGE_ITEM, id: id };
}
export function $updateItemValue(name, value) {
  return { type: actionTypes.COMPANY_SET_ITEM_VALUE, name, value };
}
export function $updateCountries(value) {
  return { type: actionTypes.COMPANY_SET_COUNTRY, value };
}
export function $disable(id) {
  return { type: actionTypes.COMPANY_ACTION_REQUEST, action: "disable", id };
}
export function $restore(id) {
  return { type: actionTypes.COMPANY_ACTION_REQUEST, action: "restore", id };
}
export function $delete(id) {
  return { type: actionTypes.COMPANY_ACTION_REQUEST, action: "delete", id };
}
export function $productId(id) {
  return { type: actionTypes.PRODUCT_FETCH_REQUEST, id };
}
export function $showCompanyDetail(id) {
  return { type: actionTypes.SHOW_COMPANY_DETAIL, id };
}
export const $fetchFrontIndex = () => ({ type: actionTypes.COMPANY_FRONT_INDEX_REQUEST });
export function $frontPage() {
  return { type: actionTypes.COMPANY_FRONT_PAGE_CHANGED};
}

const companiesRequest = (meta, searchCondition) =>
  http({
    path: `companies?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchCompany() {
  try {
    const company = yield select(store => store.company);
    const result = yield call(
      companiesRequest,
      company.meta,
      company.searchCondition
    );
    console.log(result)
    yield put({
      type: actionTypes.COMPANY_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.COMPANY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.company.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.COMPANY_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.COMPANY_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.COMPANY_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.COMPANY_INDEX_REQUEST });
}
function* searchCompany({ name, value }) {
  try {
    yield put({ type: actionTypes.COMPANY_CHANGE_SEARCH_VALUE, name, value });
    const company = yield select(store => store.company);
    const result = yield call(
      companiesRequest,
      company.meta,
			company.searchCondition 
			);
    yield put({
      type: actionTypes.COMPANY_INDEX_SUCCESS,
      data: result.data,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.COMPANY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const saveCompany = company => {
  const formData = new FormData();
  formData.append("name", company.item.name);
  formData.append("mail", company.item.mail);
  formData.append("phone", company.item.phone);
  formData.append("mobile_phone", company.item.mobile_phone);
  formData.append("website_url", company.item.website_url);
  formData.append("address", company.item.address);
  formData.append("horario", company.item.horario);
  formData.append("facebook", company.item.facebook);
  formData.append("instagram", company.item.instagram);
  formData.append("twitter", company.item.twitter);
  formData.append("description", company.item.description);
  formData.append("allCountries", company.country);
  if(company.item.all===true){
    formData.append("is_all_countries","yes");
  }
  else{
    formData.append("is_all_countries","no");
  }
  if (company.uploadImage) {
    const files = Array.from(company.uploadImage);
    files.forEach((file, i) => {
      formData.append("logo", file);
    });
  }
  if (company.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `companies/${company.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `companies`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};
function* saveItem({ history }) {
  const company = yield select(store => store.company);
  console.log(company)
  try {
    const result = yield call(saveCompany, company);
    if (result.company) {
      alert("Saving success.");
      history.push("/admin/companies");
    } else {
      if (result.errors.name) {
        yield put({
          type: actionTypes.COMPANY_SET_ITEM_ERROR,
          name: "name",
          value: result.errors.name
        });

      }
      if(result.errors.logo){
        alert(result.errors.logo);
      }
      else if(result.errors.name){
        alert(result.errors.name);
      }
      else if(result.errors.mail){
        alert(result.errors.mail);
      }
      yield put({
        type: actionTypes.COMPANY_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.COMPANY_INDEX_FAILURE,
        error: e.message
      });
      alert("Saving failed.");
      yield put({
        type: actionTypes.COMPANY_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
const countriesRequest = (meta, searchCondition) =>
  http({
    path: `countries`
  }).then(response => response.data);
function* fetchCountry() {
  try {
    yield select(store => store.company);
    const result = yield call(
      countriesRequest,
    );
    console.log(result)
    yield put({
      type: actionTypes.COMPANY_INDEX_SUCCESS,
      data: result,
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.COMPANY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* callAction({ action, id }) {
  try {
    yield call(companyActionRequest, action, id);
    const company = yield select(store => store.company);
    console.log(company);
   
    if (action === "delete") {
      yield put({ type: actionTypes.COMPANY_INDEX_REQUEST });
    } else {
      let data = company.data;
      data.forEach(item => {
        if (item.id === id) {
          if (action === "disable") item.status = "Disable";
          else item.status = "Active";
        }
      });
      yield put({
        type: actionTypes.COMPANY_INDEX_SUCCESS,
        data: data,
        meta: company.meta
      });
    }
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.COMPANY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function companyActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `companies/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `companies/${id}/${action}` }).then(
      response => response.data
    );
  }
}
function* initial(){
  yield put({
    type: actionTypes.COMPANY_SET_COUNTRY,
    value: []
  });
}
function* fetchProductId({id}){
  yield put({
    type: actionTypes.COMPANY_SET_ITEM_VALUE,
    name: "productId",
    value: id
  });
}
const showItem =(id) =>{
  return(http({ path: `companies/${id}` }).then(response => response.data));
};
function* showCompanyDetail({id}){
  yield call(fetchCountry);
  const result = yield call(showItem, id);
  yield put({ type: actionTypes.COMPANY_LOADING_REQUEST });
  if(result){
    console.log(result)
    yield put({
      type: actionTypes.COMPANY_SET_ITEM,
      item: result.company
    });
    if(result.company.is_all_countries==="no"){
      yield put({
        type: actionTypes.COMPANY_SET_ITEM_VALUE,
        name: "all",
        value: false
      });
      yield put({
        type: actionTypes.COUNTRY_FETCH_DATA,
        data: result.country
      });
    }
    else{
      yield put({
        type: actionTypes.COMPANY_SET_ITEM_VALUE,
        name: "all",
        value: true
      });
    } 
  }
}
const companiesFrontRequest = (meta) =>
  http({
    path: `companies/home?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
    })}`
  }).then(response => response.data);

function* fetchFrontCompany(){
  try {
    const company = yield select(store => store.company);
    const result = yield call(companiesFrontRequest, company.frontMeta);
    yield put({
      type: actionTypes.COMPANY_FRONT_INDEX_SUCCESS,
      frontData: result.data,
      frontMeta: { total: result.total, pageTotal: result.last_page }
    });
    if(result.total>0){
      yield put(setShopMenu({shopMenu:true}));
    }else{
      yield put(setShopMenu({shopMenu:false}));
    }
  } catch (e) {
    yield put({ type: actionTypes.COMPANY_INDEX_FAILURE, error: e.message });
  }
}
function* changeFrontPage() {
  const frontMeta = yield select(store => store.company.frontMeta);
  let page = frontMeta.page+1;
  if (page < 0) {
    page = 0;
  }

  if (page > frontMeta.pageTotal) {
    yield put({ type: actionTypes.COMPANY_FRONT_INDEX_META, frontMeta: { page: page+1 } });
    return;
  }
  yield put({ type: actionTypes.COMPANY_FRONT_INDEX_META, frontMeta: { page: page } });
  yield put({ type: actionTypes.COMPANY_FRONT_INDEX_REQUEST });
}

////////////////////////////

export function* saga() {
  yield takeLatest(actionTypes.COMPANY_INDEX_REQUEST, fetchCompany);
  yield takeLatest(actionTypes.COUNTRY_INDEX_REQUEST, fetchCountry);
  yield takeLatest(actionTypes.COMPANY_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.COMPANY_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.COMPANY_SEARCH_REQUEST, searchCompany);
  yield takeLatest(actionTypes.COMPANY_SAVE_ITEM, saveItem);
  yield takeLatest(actionTypes.COMPANY_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.COMPANY_SET_ITEM, initial);
  yield takeLatest(actionTypes.COMPANY_CHANGE_ITEM, showCompanyDetail);
  yield takeLatest(actionTypes.PRODUCT_FETCH_REQUEST, fetchProductId);
  yield takeLeading(actionTypes.COMPANY_FRONT_INDEX_REQUEST, fetchFrontCompany);
  yield takeLeading(actionTypes.COMPANY_FRONT_PAGE_CHANGED, changeFrontPage);
  // yield takeEvery(actionTypes.SHOW_COMPANY_DETAIL, showCompanyDetail);
}
 