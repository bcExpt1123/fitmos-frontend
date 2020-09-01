import { persistReducer } from "redux-persist";
import {
  put,
  call,
  takeLatest,
  takeEvery,
  select,
} from "redux-saga/effects";
import storage from "redux-persist/lib/storage";
import { http, fileDownload } from "../../app/pages/home/services/api";
import {
  INDEX_PAGE_SIZE_DEFAULT,
  INDEX_PAGE_SIZE_OPTIONS
} from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import {
  logOut,
} from "../../app/pages/home/redux/auth/actions";

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
  metaIn: {
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    total: 0
  },
  metaReport: {
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    total: 0
  },
  item: null,
  results: {},
  workouts: null,
  updatedItem: null,
  action: "",
  searchCondition: {
    search: ""
  },
  selectOptions:[],
  selectOptionData:[],
  options:null,
  data_report:[],
  errors: {
    title: "",
    description: ""
  },
  isloading: false
};
export const actionTypes = {
  SURVEY_ACTION_REQUEST_SAVETITLE: "SURVEY_ACTION_REQUEST_SAVETITLE",
  SURVEY_ACTION_REQUEST_SAVEITEM: "SURVEY_ACTION_REQUEST_SAVEITEM",
  SURVEY_SET_ITEM_VALUE: "SURVEY_SET_ITEM_VALUE",
  SURVEY_SET_ITEM: "SURVEY_SET_ITEM",
  SURVEY_INDEX_REQUEST_ACTIVE:"SURVEY_INDEX_REQUEST_ACTIVE",
  SURVEY_INDEX_REQUEST_INACTIVE:"SURVEY_INDEX_REQUEST_INACTIVE",
  SURVEY_INDEX_SUCCESS: "SURVEY_INDEX_SUCCESS",
  SURVEY_INDEX_FAILURE: "SURVEY_INDEX_FAILURE",
  SURVEY_LOADING_REQUEST: "SURVEY_LOADING_REQUEST",
  SURVEY_SEARCH_REQUEST: "SURVEY_SEARCH_REQUEST",
  SURVEY_CHANGE_SEARCH_VALUE: "SURVEY_CHANGE_SEARCH_VALUE",
  SURVEY_ACTION_REQUEST: "SURVEY_ACTION_REQUEST",
  SURVEY_CHANGE_ITEM: "SURVEY_CHANGE_ITEM",
  SURVEY_INDEX_META: "SURVEY_INDEX_META",
  SURVEY_INDEX_META_IN: "SURVEY_INDEX_META_IN",
  SURVEY_PAGE_CHANGED: "SURVEY_PAGE_CHANGED",
  SURVEY_PAGE_CHANGED_INACTIVE: "SURVEY_PAGE_CHANGED_INACTIVE",
  SURVEY_PAGESIZE_CHANGED: "SURVEY_PAGESIZE_CHANGED",
  SURVEY_PAGESIZE_CHANGED_INACTIVE: "SURVEY_PAGESIZE_CHANGED_INACTIVE",
  SURVEY_FETCH_DATA_ACTIVE:"SURVEY_FETCH_DATA_ACTIVE",
  SURVEY_FETCH_DATA_INACTIVE:"SURVEY_FETCH_DATA_INACTIVE",
  SURVEY_SHOW_DATAITEM:"SURVEY_SHOW_DATAITEM",
  SURVEY_DISPLAY_DATA_ITEM:"SURVEY_DISPLAY_DATA_ITEM",
  SURVEY_ACTION_REQUEST_ACTIVE: "SURVEY_ACTION_REQUEST_ACTIVE",
  SURVEY_ACTION_REQUEST_DELETEITEM: "SURVEY_ACTION_REQUEST_DELETEITEM",
  SURVEY_ACTION_REQUEST_EDITITEM: "SURVEY_ACTION_REQUEST_EDITITEM",
  SURVEY_INDEX_REQUEST_ITEM:"SURVEY_INDEX_REQUEST_ITEM",
  SURVEY_INITIAL:"SURVEY_INITIAL",
  SURVEY_SELECT_OPTION_SAVE:"SURVEY_SELECT_OPTION_SAVE",
  SURVEY_SELECT_OPTION:"SURVEY_SELECT_OPTION",
  SURVEY_SELECT_OPTION_DATA:"SURVEY_SELECT_OPTION_DATA",
  SURVEY_SELECT_OPTIONS:"SURVEY_SELECT_OPTIONS",
  SURVEY_SELECT_OPTIONS_DELETE:"SURVEY_SELECT_OPTIONS_DELETE",
  SURVEY_SELECT_OPTIONS_EDIT:"SURVEY_SELECT_OPTIONS_EDIT",
  SURVEY_SELECT_OPTION_ITEM_SAVE:"SURVEY_SELECT_OPTION_ITEM_SAVE",
  SURVEY_REPORT_FETCH_DATA:"SURVEY_REPORT_FETCH_DATA",
  SURVEY_INDEX_META_REPORT:"SURVEY_INDEX_META_REPORT",
  SURVEY_PAGESIZE_CHANGED_REPORT:"SURVEY_PAGESIZE_CHANGED_REPORT",
  SURVEY_REPORT_DATAITEM:"SURVEY_REPORT_DATAITEM",
  SURVEY_REPORT_VIEWREPORT:"SURVEY_REPORT_VIEWREPORT",
  SURVEY_PAGE_CHANGED_REPORT:"SURVEY_PAGE_CHANGED_REPORT",
  SURVEY_REPORT_MORE_DETAIL:"SURVEY_REPORT_MORE_DETAIL",
  SURVEY_EXPORT:"SURVEY_EXPORT",

};
export const reducer = persistReducer(
  {
    storage,
    key: "survey",
    whitelist: []
  },
  (state = initialState, action) => {
    const clonedErrors = Object.assign({}, state.errors);
    switch (action.type) {
      case actionTypes.SURVEY_INDEX_META:
        return { ...state, meta: { ...state.meta, ...action.meta }  ,data:action.data};
      case actionTypes.SURVEY_INDEX_META_IN:
        return { ...state, metaIn: { ...state.metaIn, ...action.metaIn }  ,data:action.data};
      case actionTypes.SURVEY_INDEX_META_REPORT:
        return { ...state, metaReport: { ...state.metaReport, ...action.metaReport }  ,data:action.data};
      case actionTypes.SURVEY_SELECT_OPTION:
        return { ...state ,selectOptions:action.data};  
      case actionTypes.SURVEY_SELECT_OPTION_DATA:
        return { ...state ,selectOptionData:action.data};
      case actionTypes.SURVEY_SELECT_OPTIONS:
        return { ...state ,options:action.data};  
      case actionTypes.SURVEY_FETCH_DATA_ACTIVE:
        return { ...state  ,data_active:action.data};
      case actionTypes.SURVEY_FETCH_DATA_INACTIVE:
        return { ...state  ,data_inactive:action.data};
      case actionTypes.SURVEY_SHOW_DATAITEM:
        return { ...state  ,data_display:action.data};
      case actionTypes.SURVEY_REPORT_DATAITEM:
        return { ...state  ,data_report:action.data};
      case actionTypes.SURVEY_REPORT_VIEWREPORT:
        return { ...state  ,viewReport:action.data};
      case actionTypes.SURVEY_DISPLAY_DATA_ITEM:
      return { ...state  ,data_display_item:action.data};
      case actionTypes.SURVEY_INDEX_SUCCESS:
        return { ...state, data: action.data, meta: { ...state.meta, ...action.meta }};
      case actionTypes.SURVEY_LOADING_REQUEST:
        return { ...state, isloading: true };
      case actionTypes.SURVEY_CHANGE_SEARCH_VALUE:
        const searchItem = Object.assign({}, state.searchCondition);
        const searchCondition = { ...searchItem, [action.name]: action.value };
        const clonedMeta = Object.assign({}, state.meta);
        const meta = { ...clonedMeta, page: 1 };
        return { ...state, searchCondition, meta };
      case actionTypes.SURVEY_SET_ITEM_VALUE:
        const clonedItem = Object.assign({}, state.item);
        const item = { ...clonedItem, [action.name]: action.value };
        const errors1 = { ...clonedErrors, [action.name]: "" };
        return { ...state, item, errors: errors1 };
      case actionTypes.SURVEY_SET_VALUE:
        return { ...state, [action.key]: action.value };
      case actionTypes.SURVEY_SET_ITEM:
        return { ...state, item: action.item,updatedItem: action.item,isloading: false,isSaving: false,};
      case actionTypes.SURVEY_CHANGE_SAVE_STATUS:
        return { ...state, isSaving: action.status };
      case actionTypes.SURVEY_SET_ITEM_ERROR:
        const errors = { ...clonedErrors, [action.name]: action.value };
        return { ...state, errors };
      case actionTypes.SURVEY_UPDATE_RESULT:
        const clonedPublished = [...state.published];
        const index = clonedPublished.findIndex(item => item.id === action.id);
        if (index > -1) {
          clonedPublished[index].result = action.repetition;
        }
        return { ...state, published: clonedPublished };
      default:
        return state;
    }
  }
);
export const actions = {
  fetchIndexRequest: () => ({ type: actionTypes.SURVEY_INDEX_REQUEST_ACTIVE }),

  fetchIndexSuccess: payload => ({
    payload,
    type: actionTypes.SURVEY_INDEX_SUCCESS
  }),

  fetchIndexFailure: () => ({
    type: actionTypes.SURVEY_INDEX_FAILURE
  })
};
export function $actionSurveyTitleSave(history) {
  return { type: actionTypes.SURVEY_ACTION_REQUEST_SAVETITLE, action: "actionSurveyTitleSave",history };
}
export function $actionSurveyItemSave() {
  return { type: actionTypes.SURVEY_ACTION_REQUEST_SAVEITEM, action: "actionSurveyItemSave" };
}
export function $updateItemValue(name, value) {
  return { type: actionTypes.SURVEY_SET_ITEM_VALUE, name, value };
}
export const $fetchIndexActive = () => ({
  type: actionTypes.SURVEY_INDEX_REQUEST_ACTIVE
});
export const $fetchIndexInactive = () => ({
  type: actionTypes.SURVEY_INDEX_REQUEST_INACTIVE
});
export const $fetchIndexItem = () => ({
  type: actionTypes.SURVEY_INDEX_REQUEST_ITEM
});
export function $changeConditionValue(name, value) {
  return { type: actionTypes.SURVEY_SEARCH_REQUEST, name, value };
}
export function $selectOptionItem(data) {
  return { type: actionTypes.SURVEY_SELECT_OPTION, data };
}
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }
  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.SURVEY_PAGESIZE_CHANGED, pageSize: pageSize };
}
export function $pageSizeInactive(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.SURVEY_PAGESIZE_CHANGED_INACTIVE, pageSize: pageSize };
}
export function $pageSizeReport(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }
  return { type: actionTypes.SURVEY_PAGESIZE_CHANGED_REPORT, pageSize: pageSize };
}
export function $changeItem(id) {
  return { type: actionTypes.SURVEY_CHANGE_ITEM, id: id };
}
export function $setNewItem() {
  const item = { id: null, title: "", from_date: "", to_date: "",};
  return { type: actionTypes.SURVEY_SET_ITEM, item };
}
export function $page(page = 1) {
  return { type: actionTypes.SURVEY_PAGE_CHANGED, page: page };
}
export function $pageReport(page = 1) {
  return { type: actionTypes.SURVEY_PAGE_CHANGED_REPORT, page: page };
}
export function $pageInactive(page = 1) {
  return { type: actionTypes.SURVEY_PAGE_CHANGED_INACTIVE, page: page };
}
export function $deleteActive(id) {
  return { type: actionTypes.SURVEY_ACTION_REQUEST_ACTIVE, action: "delete", id };
}
export function $deleteItem(id) {
  return { type: actionTypes.SURVEY_ACTION_REQUEST_DELETEITEM, action: "deleteItem", id };
}
export function $initial() {
  return { type: actionTypes.SURVEY_INITIAL };
}
export function $editItem(id) {
  return { type: actionTypes.SURVEY_ACTION_REQUEST_EDITITEM, action: "editItem", id };
}

export function $selectOptionSave(){
  return {  type:actionTypes.SURVEY_SELECT_OPTION_SAVE};
}
export function $deleteSelectItem(id) {
  return { type: actionTypes.SURVEY_SELECT_OPTIONS_DELETE, id };
}

export function $editOptionItem(id,option_label) {
  return { type: actionTypes.SURVEY_SELECT_OPTIONS_EDIT, id,option_label};
}
export function $selectOptionItemSave(){
  return { type: actionTypes.SURVEY_SELECT_OPTION_ITEM_SAVE };
}
export function $fetchSurveyReport(id) {
  return { type: actionTypes.SURVEY_REPORT_FETCH_DATA, id: id };
}
export function $moreDetail(id) {
  return { type: actionTypes.SURVEY_REPORT_MORE_DETAIL, id };
}
export function $export(id){
  return { type: actionTypes.SURVEY_EXPORT, id };
}
function* actionSurveyTitleSave({history}) {
  const survey = yield select(store => store.survey);
  const result = yield call(surveyActionRequest, survey);
  if(result.survey){
    alert("Saving success.");
    history.push(`/admin/survey/${result.survey.id}`);
    yield put({
      type: actionTypes.SURVEY_SET_ITEM_VALUE,
      name: "id",
      value: result.survey.id
    });
  }
 
}
const surveyActionRequest = survey =>  {
  const formData = new FormData();
  formData.append("title", survey.item.title);
  formData.append("from_date", survey.item.from_date);
  formData.append("to_date", survey.item.to_date);
  if (survey.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `surveys/${survey.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else{
    return http({ 
      path: `surveys`, 
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      } 
    }).then(
      response => response.data );
  }
}
function* actionSurveyItemSave() {
  const survey = yield select(store => store.survey);
  const result = yield call(surveySaveActionRequest, survey);
  if(result){
    yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ITEM });
  }
}
const surveySaveActionRequest = (survey) =>  {
  const formData = new FormData();
  if(survey.item.question){
    formData.append("label", survey.item.question);
  }
  else{
    formData.append("label",survey.data_display_item.label);
  }
  if(survey.item.question){
    formData.append("question", survey.item.radio);
  }
  else{
    formData.append("question", survey.data_display_item.question);
  }
  formData.append("survey_id",survey.item.id);
  if (survey.data_display_item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `survey-items/${survey.data_display_item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  }
  else{
    return http({ 
      path: `survey-items`, 
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      } 
    }).then(
        response => response.data );
  }
}
const surveyActiveRequest = (meta, searchCondition) =>
  http({
    path: `surveys/active?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page-1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchSurveyActive() {
  try {
    const survey = yield select(store => store.survey);
    const result = yield call(
      surveyActiveRequest,
      survey.meta,
      survey.searchCondition
    );
    yield put({
      type: actionTypes.SURVEY_FETCH_DATA_ACTIVE,
      data: result.data,
    });
    yield put({
      type: actionTypes.SURVEY_INDEX_META,
      meta: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {}
}
const surveyInactiveRequest = (metaIn, searchCondition) =>
  http({
    path: `surveys/inactive?${serializeQuery({
      pageSize: metaIn.pageSize,
      pageNumber: metaIn.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchSurveyInactive() {
  try {
    const survey = yield select(store => store.survey);
    const result = yield call(
      surveyInactiveRequest,
      survey.metaIn,
      survey.searchCondition
    );
    yield put({
      type: actionTypes.SURVEY_FETCH_DATA_INACTIVE,
      data: result.data,
    });
    yield put({
      type: actionTypes.SURVEY_INDEX_META_IN,
      metaIn: { total: result.total, pageTotal: result.last_page }
    });
  } catch (e) {}
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.SURVEY_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ACTIVE });
}
function* changePage({ page }) {
  const meta = yield select(store => store.survey.meta);
  if (page < 0) {
    page = 0;
  }
  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.SURVEY_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ACTIVE }); 
}
function* changePageReport({ page }) {
  const meta = yield select(store => store.survey.metaReport);
  if (page < 0) {
    page = 0;
  }
  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.SURVEY_INDEX_META_REPORT, metaReport: { page: page } });
  yield put({ type: actionTypes.SURVEY_REPORT_FETCH_DATA }); 
}
function* changePageSizeInactive({ pageSize }) {
  yield put({
    type: actionTypes.SURVEY_INDEX_META_IN,
    metaIn: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_INACTIVE });
}
function* changePageSizeReport({ pageSize }) {
  yield put({
    type: actionTypes.SURVEY_INDEX_META_REPORT,
    metaReport: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.SURVEY_REPORT_FETCH_DATA });
}
function* changePageInactive({ page }) {
  const metaIn = yield select(store => store.survey.metaIn);
  if (page < 0) {
    page = 0;
  }
  if (page > metaIn.pageTotal) {
    page = metaIn.pageTotal - 1;
  }
  yield put({ type: actionTypes.SURVEY_INDEX_META_IN, metaIn: { page: page } });
  yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_INACTIVE });
}
function* searchSurvey({ name, value }) {
  try {
    yield put({ type: actionTypes.SURVEY_CHANGE_SEARCH_VALUE, name, value });
    const survey = yield select(store => store.survey);
    const result = yield call(
      surveyActiveRequest,
      survey.meta,
      survey.searchCondition
    );
    const resultIn = yield call(
      surveyInactiveRequest,
      survey.metaIn,
      survey.searchCondition
    );
    yield put({
      type: actionTypes.SURVEY_FETCH_DATA_ACTIVE,
      data: result.data,
    });
    yield put({
      type: actionTypes.SURVEY_INDEX_META,
      meta: { total: result.total, pageTotal: result.last_page }
    });
    yield put({
      type: actionTypes.SURVEY_FETCH_DATA_INACTIVE,
      data: resultIn.data,
    });
    yield put({
      type: actionTypes.SURVEY_INDEX_META_IN,
      metaIn: { total: resultIn.total, pageTotal: resultIn.last_page }
    });
  } catch (e) {
    if (e.response.status === 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.SURVEY_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
const findSurvey = id =>
  http({ path: `surveys/${id}` }).then(response => response.data);
function* changeItem({ id }) {
  yield put({ type: actionTypes.SURVEY_LOADING_REQUEST });
  try {
    const result = yield call(findSurvey, id);
    if (result.survey.id){
      yield put({ type: actionTypes.SURVEY_SET_ITEM, item: result.survey });
      yield put({
        type: actionTypes.SURVEY_SHOW_DATAITEM,
        data: result.items,
      });
      yield put({
        type: actionTypes.SURVEY_SELECT_OPTIONS,
        data: result.options,
      });
      yield put({
        type: actionTypes.SURVEY_DISPLAY_DATA_ITEM,
        data: [],
      });
    }
    else yield put({ type: actionTypes.SURVEY_SET_ITEM, item: null });
  } catch (e) {
    
  }
}
function* callActionActive({ action, id }) {
  try {
    const survey = yield select(store => store.survey);
    if (action === "delete") {
      const result = yield call(surveyActiveActionRequest, action, id);
      yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ACTIVE });
      yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_INACTIVE });
      if(result){
        alert('Success!');
      }
    } 
    if (action === "deleteItem"){
      const result = yield call(surveyActiveActionRequest, action, id);
      if(result){
        yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ITEM });
        alert('Success!');
      }
    }
    if  (action === "editItem"){
        const resultData=survey.data_display;
        const resultSelect=survey.options;
        const filterSurvey = resultData.filter(result => result.id === id);
        const filterOptions = resultSelect.filter(result =>result.survey_item_id === id);
        yield put({
          type: actionTypes.SURVEY_DISPLAY_DATA_ITEM,
          data: filterSurvey[0],
        });
        yield put({
          type: actionTypes.SURVEY_SELECT_OPTION_DATA,
          data: filterOptions,
        });
        yield put({
          type: actionTypes.SURVEY_SET_ITEM_VALUE,
          name: 'radio',
          value: '',
        });
    }
  } catch (e) {

  }
}
function surveyActiveActionRequest(action, id) {
  if (action === "delete") {
    return http({ path: `surveys/${id}`, method: "delete" }).then(
      response => response.data
    );
  }
  else if(action === "deleteItem"){
    return http({ path: `survey-items/${id}`, method: "delete" }).then(
      response => response.data
    );
  }
  else if(action === "editItem"){
    return http({ path: `survey-items/${id}` }).then(
      response => response.data
    );
  }
}
const surveyItemRequest = (id) =>
  http({
    path: `survey-items?survey_id=`+id,
    method:"get"
  }).then(response => response.data);
function* fetchSurveyItem() {
  try {
    const survey = yield select(store => store.survey);
    const id = survey.item.id;
    if(id){
      const result = yield call(surveyItemRequest,id);
      if(result){
        yield put({
          type: actionTypes.SURVEY_SHOW_DATAITEM,
          data: result.fetchData,
        });
        yield put({
          type: actionTypes.SURVEY_SELECT_OPTIONS,
          data: result.options,
        });
      }
    }
    else{
      yield put({
        type: actionTypes.SURVEY_SHOW_DATAITEM,
        data: [],
      });
      yield put({
        type: actionTypes.SURVEY_DISPLAY_DATA_ITEM,
        data: [0],
      });
    } 
  } catch (e) {
    // console.log(e)
  }
}
function* initialItem() {
  try {
    yield put({
      type: actionTypes.SURVEY_DISPLAY_DATA_ITEM,
      data: [0],
    });
    yield put({
      type: actionTypes.SURVEY_SET_ITEM_VALUE,
      name: 'radio',
      value: '',
    });
    yield put({
      type: actionTypes.SURVEY_SELECT_OPTION,
      data:null,
    });
  } catch(e){

  }
}
const selectOptionSaveRequest = (survey) => {
  if(survey.item.question){
    const formData = new FormData();
    formData.append("question",survey.item.question);
    if (survey.selectOptions) {
      const items = Array.from(survey.selectOptions);
      items.forEach((item, i) => {
        formData.append(i, item);
      });
    }
    if (survey.item.id) {
      return http({
        path: `survey-items/selectOptions/${survey.item.id}`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.data);
    } else {
      return http({
        path: `survey-items/selectOptions`,
        method: "POST",
        data: formData,
        headers: {
          "content-type": "multipart/form-data"
        }
      }).then(res => res.data);
    }
  }
  else{
    alert('Please enter question!');
  }
};
function* selectOptionSave(){
  const survey = yield select(store => store.survey); 
  const result = yield call(selectOptionSaveRequest, survey);
  if(result){
    yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ITEM });
  }
}
const selectOptionDeleteRequest =(id)=>{
  return http({ path: `survey-items/selectOptionDelete/${id}` }).then(
    response => response.data
  );
}
function* selectOptionDelete({id}){
  const survey = yield select(store => store.survey);
  const result = yield call(selectOptionDeleteRequest,id);
  if(result){
    console.log(id);
    const resultSelect=survey.selectOptionData;
    const filterOptions = resultSelect.filter(result =>result.id !== id);
    console.log(filterOptions);
    yield put({
      type: actionTypes.SURVEY_SELECT_OPTION_DATA,
      data: filterOptions,
    });
    yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ITEM });
  }
}

const selectOptionItemSaveRequest = (survey) => {
  const formData = new FormData();
  if(survey.item.option_label){
    formData.append('option_label',survey.item.option_label);
    if (survey.data_display_item.id) {
      return http({
        path: `survey-items/selectOptionItems/${survey.data_display_item.id}`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.data);
    }
  }
  else{
    alert("Please enter option!");
  }
}
function* selectOptionItemSave(){
  const survey = yield select(store => store.survey);
  const result = yield call(selectOptionItemSaveRequest, survey);
  if(result){
    yield put({
      type: actionTypes.SURVEY_SELECT_OPTION_DATA,
      data:result.selectOption,
    });

    yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ITEM });
    yield put({
      type: actionTypes.SURVEY_SELECT_OPTION_DATA,
      data: result.selectOptionData,
    });
    yield put({
      type: actionTypes.SURVEY_SET_ITEM_VALUE,
      name: "option_label",
      value: "",
    });
  }
}

const editOptionRequest = (id,option_label,survey) => {
  const formData = new FormData();
  formData.append('option_label',option_label);
  formData.append('survey_item_id',survey.data_display_item.id);
    return http({
      path: `survey-items/selectEditOptionItems/${id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
}
function* selectOptionEdit({id,option_label}) {
  const survey = yield select(store =>store.survey);
  const result = yield call(editOptionRequest,id,option_label,survey);
  if(result){
    yield put({
      type: actionTypes.SURVEY_SELECT_OPTION_DATA,
      data:result.selectOption,
    });
    yield put({ type: actionTypes.SURVEY_INDEX_REQUEST_ITEM });
    yield put({
      type: actionTypes.SURVEY_SELECT_OPTION_DATA,
      data: result.selectOptionData,
    });
    yield put({
      type: actionTypes.SURVEY_SET_ITEM_VALUE,
      name: "option_label",
      value: "",
    });
  }
}
const findSurveyReport = (metaReport,id) =>
  http({
    path: `survey-reports?${serializeQuery({
      pageSize: metaReport.pageSize,
      pageNumber: metaReport.page - 1,
      survey_id: id,
  })}` }).then(response => response.data);

function* fetchSurveyReportItems({id}){
  console.log(id);
  const survey = yield select(store => store.survey);
  const result = yield call( findSurveyReport,survey.metaReport,id);
  if(result){
    yield put({
      type: actionTypes.SURVEY_REPORT_DATAITEM,
      data: result.data.data,
    });
    yield put({
      type: actionTypes.SURVEY_INDEX_META_REPORT,
      metaReport: { total: result.data.total, pageTotal: result.data.last_page }
    });
    yield put({
      type: actionTypes.SURVEY_SET_ITEM_VALUE,
      name: "surveyId",
      value: id,
    });
  }
};
const viewReportRequest = (id,surveyId) =>{
  const formData = new FormData();
  formData.append('customerId',id);
  formData.append('surveyId',surveyId);
  return http({
    path: `survey-reports/view`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.data);
}
function* viewReport({id}){
  const survey = yield select(store => store.survey);
  const surveyId = survey.item.surveyId;
  const result = yield call(viewReportRequest,id,surveyId);
  if(result){
    yield put({
      type: actionTypes.SURVEY_REPORT_VIEWREPORT,
      data: result.data,
    });
  }
}
function download(path,id){
  fileDownload({path}).then((response)=>{
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `survey-${id}.xlsx`); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}
function* exportSurvey({id}){
  const path = `survey-reports/export?survey_id=${id}`;
  try{
    yield call(download,path,id);
  }catch(e){
    console.log(e)
  }
}
export function* saga(){
  yield takeLatest(actionTypes.SURVEY_INDEX_REQUEST_ACTIVE, fetchSurveyActive);
  yield takeLatest(actionTypes.SURVEY_INDEX_REQUEST_INACTIVE, fetchSurveyInactive);
  yield takeLatest(actionTypes.SURVEY_INDEX_REQUEST_ITEM, fetchSurveyItem);
  yield takeEvery(actionTypes.SURVEY_ACTION_REQUEST_SAVETITLE, actionSurveyTitleSave);
  yield takeLatest(actionTypes.SURVEY_ACTION_REQUEST_SAVEITEM, actionSurveyItemSave);
  yield takeLatest(actionTypes.SURVEY_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.SURVEY_PAGE_CHANGED_INACTIVE, changePageInactive);
  yield takeLatest(actionTypes.SURVEY_PAGE_CHANGED_REPORT, changePageReport);
  yield takeLatest(actionTypes.SURVEY_PAGESIZE_CHANGED_INACTIVE, changePageSizeInactive);
  yield takeLatest(actionTypes.SURVEY_PAGESIZE_CHANGED_REPORT, changePageSizeReport);
  yield takeLatest(actionTypes.SURVEY_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.SURVEY_SEARCH_REQUEST, searchSurvey);
  yield takeLatest(actionTypes.SURVEY_CHANGE_ITEM, changeItem);
  yield takeLatest(actionTypes.SURVEY_ACTION_REQUEST_ACTIVE, callActionActive);
  yield takeLatest(actionTypes.SURVEY_ACTION_REQUEST_DELETEITEM, callActionActive);
  yield takeLatest(actionTypes.SURVEY_ACTION_REQUEST_EDITITEM, callActionActive);
  yield takeLatest(actionTypes.SURVEY_INITIAL, initialItem);
  yield takeEvery(actionTypes.SURVEY_SELECT_OPTION_SAVE,  selectOptionSave);
  yield takeLatest(actionTypes.SURVEY_SELECT_OPTIONS_DELETE, selectOptionDelete);
  yield takeLatest(actionTypes.SURVEY_SELECT_OPTION_ITEM_SAVE, selectOptionItemSave);
  yield takeLatest(actionTypes.SURVEY_SELECT_OPTIONS_EDIT, selectOptionEdit);
  yield takeLatest(actionTypes.SURVEY_REPORT_FETCH_DATA, fetchSurveyReportItems);
  yield takeLatest(actionTypes.SURVEY_REPORT_MORE_DETAIL, viewReport);
  yield takeLatest(actionTypes.SURVEY_EXPORT, exportSurvey);
}
