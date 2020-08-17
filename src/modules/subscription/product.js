import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import {put,call,takeLatest,takeLeading,select,delay} from "redux-saga/effects";
import { push } from "react-router-redux";
import storage from "redux-persist/lib/storage";
import { http } from "../../app/pages/home/services/api";
import {INDEX_PAGE_SIZE_DEFAULT,INDEX_PAGE_SIZE_OPTIONS } from "../constants/constants";
import { serializeQuery } from "../../app/components/utils/utils";
import {logOut} from "../../app/pages/home/redux/auth/actions";


export const actionTypes = {
    PRODUCT_INDEX_REQUEST: "PRODUCT_INDEX_REQUEST",
    COUNTRY_INDEX_REQUEST: "COUNTRY_INDEX_REQUEST",
    PRODUCT_INDEX_SUCCESS: "PRODUCT_INDEX_SUCCESS",
    PRODUCT_INDEX_FAILURE: "PRODUCT_INDEX_FAILURE",
    PRODUCT_LOADING_REQUEST: "PRODUCT_LOADING_REQUEST",
    PRODUCT_SEARCH_REQUEST: "PRODUCT_SEARCH_REQUEST",
    PRODUCT_CHANGE_SEARCH_VALUE: "PRODUCT_CHANGE_SEARCH_VALUE",
    PRODUCT_ACTION_REQUEST: "PRODUCT_ACTION_REQUEST",
    PRODUCT_CHANGE_ITEM: "PRODUCT_CHANGE_ITEM",
    PRODUCT_UPLOAD_IMAGE: "PRODUCT_UPLOAD_IMAGE",
    PRODUCT_SAVE_ITEM: "PRODUCT_SAVE_ITEM",
    PRODUCT_SET_ITEM: "PRODUCT_SET_ITEM",
    PRODUCT_SET_VALUE: "PRODUCT_SET_VALUE",
    PRODUCT_SET_ITEM_VALUE: "PRODUCT_SET_ITEM_VALUE",
    PRODUCT_CHANGE_SAVE_STATUS: "PRODUCT_CHANGE_SAVE_STATUS",
    PRODUCT_SET_ITEM_ERROR: "PRODUCT_SET_ITEM_ERROR",
    PRODUCT_UPDATE_RESULT: "PRODUCT_UPDATE_RESULT",
    PRODUCT_GALLERY:"PRODUCT_GALLERY",////////////////////
    //for pagination
    PRODUCT_INDEX_META: "PRODUCT_INDEX_META",
    PRODUCT_PAGE_CHANGED: "PRODUCT_PAGE_CHANGED",
    PRODUCT_PAGESIZE_CHANGED: "PRODUCT_PAGESIZE_CHANGED",
    ////customize
    PRODUCT_FETCH_RADIO_VALUE:"PRODUCT_FETCH_RADIO_VALUE",///////////////////
    PRODUCT_SHOW_DETAIL:"PRODUCT_SHOW_DETAIL",////////////////
    PRODUCT_VIEW_IMAGES:"PRODUCT_VIEW_IMAGES",////////////////
    PRODUCT_DELETE_IMAGE:"PRODUCT_DELETE_IMAGE",
    //frontend
    PRODUCT_FRONT_INDEX_REQUEST:"PRODUCT_FRONT_INDEX_REQUEST",
    PRODUCT_FRONT_INDEX_SUCCESS:"PRODUCT_FRONT_INDEX_SUCCESS",
    PRODUCT_FRONT_PAGE_CHANGED:"PRODUCT_FRONT_PAGE_CHANGED",
    PRODUCT_FRONT_SHOW:"PRODUCT_FRONT_SHOW",
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
    item: {
      image:"",
    },
    company:null,
    frontData:null,
    frontMeta: {
      page: 1,
      pageSize: 6,
      pageTotal: 1,
      total: 0
    },  
    companyId:null,
    published: [],
    results: {},
    workouts: null, //recent workouts on customer dashboard
    updatedItem: null,
    action: "",
    searchCondition: {
      search: ""
    },
    uploadImage: null,
    deleteImage:null,
    errors: {
      title: "",
      description: ""
    },
    isloading: false
  };
  
  export const reducer = persistReducer(
    {
      storage,
      key: "product",
      whitelist: []
    },
    (state = initialState, action) => {
      const clonedErrors = Object.assign({}, state.errors);
      switch (action.type) {
        case actionTypes.PRODUCT_GALLERY:
          return { ...state  ,gallery:action.data};
        case actionTypes.PRODUCT_INDEX_META:
          return { ...state, meta: { ...state.meta, ...action.meta } };
  
        case actionTypes.PRODUCT_INDEX_SUCCESS:
          return {
            ...state,
            data: action.data,
            meta: { ...state.meta, ...action.meta }
          };
  
        case actionTypes.PRODUCT_LOADING_REQUEST:
          return { ...state, isloading: true };
        case actionTypes.PRODUCT_CHANGE_SEARCH_VALUE:
          const searchItem = Object.assign({}, state.searchCondition);
          const searchCondition = { ...searchItem, [action.name]: action.value };
          const clonedMeta = Object.assign({}, state.meta);
          const meta = { ...clonedMeta, page: 1 };
          return { ...state, searchCondition, meta };
        case actionTypes.PRODUCT_UPLOAD_IMAGE:
          return { ...state, uploadImage: action.image };
        case actionTypes.PRODUCT_DELETE_IMAGE:
          return { ...state, deleteImage: action.image };
        case actionTypes.PRODUCT_SET_ITEM_VALUE:
          const clonedItem = Object.assign({}, state.item);
          const item = { ...clonedItem, [action.name]: action.value };
          const errors1 = { ...clonedErrors, [action.name]: "" };
          return { ...state, item, errors: errors1 };
        case actionTypes.PRODUCT_SET_VALUE:
          return { ...state, [action.key]: action.value };
        case actionTypes.PRODUCT_SET_ITEM:
          return {
            ...state,
            item: action.item,
            updatedItem: action.item,
            isloading: false,
            isSaving: false,
            uploadImage: null
          };
        case actionTypes.PRODUCT_CHANGE_SAVE_STATUS:
          return { ...state, isSaving: action.status };
        case actionTypes.PRODUCT_SET_ITEM_ERROR:
          const errors = { ...clonedErrors, [action.name]: action.value };
          return { ...state, errors };
        case actionTypes.PRODUCT_UPDATE_RESULT:
          const clonedPublished = [...state.published];
          const index = clonedPublished.findIndex(item => item.id == action.id);
          if (index > -1) {
            clonedPublished[index].result = action.repetition;
          }
          return { ...state, published: clonedPublished };
        case actionTypes.PRODUCT_FRONT_INDEX_SUCCESS:
          return {
            ...state,
            frontData: action.frontData,
            frontMeta: { ...state.frontMeta, ...action.frontMeta }
          };
        case actionTypes.PRODUCT_FRONT_INDEX_META:
          return { ...state, frontMeta: { ...state.frontMeta, ...action.frontMeta } };
    
        default:
          return state;
      }
    }
  );

  export const $fetchIndexProducts = () => ({
    type: actionTypes.PRODUCT_INDEX_REQUEST
	});
	export function $page(page = 1) {
    return { type: actionTypes.PRODUCT_PAGE_CHANGED, page: page };
  }
  export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
    if (pageSize < 1) {
      pageSize = 10;
    }
  
    if (pageSize > 100) {
      pageSize = 100;
    }
    return { type: actionTypes.PRODUCT_PAGESIZE_CHANGED, pageSize: pageSize };
  }
  export function $updateItemValue(name, value) {
    return { type: actionTypes.PRODUCT_SET_ITEM_VALUE, name, value };
  }
  export function $setNewItem() {
    const item = { id: null, 
      name: "", 
      description: "", 
      discoun: "", 
      image: "",
      expiration_date:"",
      regular_price:"",
      price:"",
      voucher_type:"once",
      price_type:"offer",
      codigo:"",
      link:"",
    };
    return { type: actionTypes.PRODUCT_SET_ITEM, item };
  }
  export function $saveItem(history) {
    return { type: actionTypes.PRODUCT_SAVE_ITEM, history };
  }
  export function $disable(id) {
    return { type: actionTypes.PRODUCT_ACTION_REQUEST, action: "disable", id };
  }
  export function $restore(id) {
    return { type: actionTypes.PRODUCT_ACTION_REQUEST, action: "restore", id };
  }
  export function $delete(id) {
    return { type: actionTypes.PRODUCT_ACTION_REQUEST, action: "delete", id };
  }
  export function $updateItemImage(image) {
    return { type: actionTypes.PRODUCT_UPLOAD_IMAGE, image };
  }
  export function $showProductDetail(id) {
    return { type: actionTypes.PRODUCT_SHOW_DETAIL, id };
  }
  export function $viewImagesAction(id) {
    return { type: actionTypes.PRODUCT_VIEW_IMAGES, id };
  }
  export function $changeItem(id) {
    return { type: actionTypes.PRODUCT_CHANGE_ITEM, id: id };
  }
   export function $deleteImage(image) {
    return { type: actionTypes.PRODUCT_DELETE_IMAGE, image };
  }
  export const $fetchFrontIndex = (companyId) => ({ type: actionTypes.PRODUCT_FRONT_INDEX_REQUEST,companyId });
  export function $frontPage(page = 1) {
    return { type: actionTypes.PRODUCT_FRONT_PAGE_CHANGED, page: page };
  }
  export const $showFrontProduct = (id) => ({ type: actionTypes.PRODUCT_FRONT_SHOW,id });
  
	const productsRequest = (meta, searchCondition,item) =>
  http({
    path: `products?${serializeQuery({
			company_id:item.productId,
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
      search: searchCondition.search
    })}`
  }).then(response => response.data);
function* fetchProducts() {
  try {
		const company = yield select(store=>store.company);
		// console.log(company.item.productId);
    const product = yield select(store => store.product);
    const result = yield call(
      productsRequest,
      product.meta,
			product.searchCondition,
			company.item
    );
    console.log(result)
    yield put({
      type: actionTypes.PRODUCT_INDEX_SUCCESS,
      data: result.indexData.data,
      meta: { total: result.indexData.total, pageTotal: result.indexData.last_page }
    });
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.PRODUCT_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function* changePage({ page }) {
  const meta = yield select(store => store.product.meta);
  if (page < 0) {
    page = 0;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }
  yield put({ type: actionTypes.PRODUCT_INDEX_META, meta: { page: page } });
  yield put({ type: actionTypes.PRODUCT_INDEX_REQUEST });
}
function* changePageSize({ pageSize }) {
  yield put({
    type: actionTypes.PRODUCT_INDEX_META,
    meta: { page: 1, pageSize: pageSize }
  });
  yield put({ type: actionTypes.PRODUCT_INDEX_REQUEST });
}

///////////////////////////////////////////
const saveProduct = (product,company) => {
  console.log(product)
  const formData = new FormData();
  formData.append("company_id",company.item.productId);
  formData.append("name", product.item.name);
  formData.append("price_type", product.item.price_type);
  formData.append("voucher_type", product.item.voucher_type);
  if(product.item.price_type=="discounted"){
    formData.append("discount", product.item.discount);
  }
  if(product.item.price_type=="offer"){
    formData.append("regular_price", product.item.regular_price);
    formData.append("price", product.item.price);
  }
  formData.append("description", product.item.description);
  formData.append("expiration_date", product.item.expiration_date);
  formData.append("codigo", product.item.codigo);
  formData.append("link", product.item.link);
  if (product.uploadImage) {
    const files = Array.from(product.uploadImage);
    files.forEach((file, i) => {
      formData.append(i, file);
    });
  }
  if (product.item.id) {
    formData.append("_method", "PUT");
    return http({
      path: `products/${product.item.id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.data);
  } else {
    return http({
      path: `products`,
      method: "POST",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    }).then(res => res.data);
  }
};

function* saveItem({ history }) {
  const product = yield select(store => store.product);
  const company = yield select(store => store.company);
  
  console.log(product)
  yield put({ type: actionTypes.PRODUCT_CHANGE_SAVE_STATUS, status: true });
  try {
    const result = yield call(saveProduct, product,company);
    if (result.product) {
      console.log(company.item.productId)
      alert("Saving success.");
      history.push(`/admin/companies/${company.item.productId}/products`);
    } else {
      if (result.errors.name) {
        yield put({
          type: actionTypes.PRODUCT_SET_ITEM_ERROR,
          name: "name",
          value: result.errors.name
        });
      }
      yield put({
        type: actionTypes.PRODUCT_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.PRODUCT_INDEX_FAILURE,
        error: e.message
      });
      alert("Saving failed.");
      yield put({
        type: actionTypes.PRODUCT_CHANGE_SAVE_STATUS,
        status: false
      });
    }
  }
}
function* callAction({ action, id }) {
  try {
    const result = yield call(productActionRequest, action, id);
    const product = yield select(store => store.product);
    console.log(product);
   
    if (action == "delete") {
      yield put({ type: actionTypes.PRODUCT_INDEX_REQUEST });
    } else {
      let data = product.data;
      data.forEach(item => {
        if (item.id == id) {
          if (action == "disable") item.status = "Disabled";
          else item.status = "Active";
        }
      });
      yield put({
        type: actionTypes.PRODUCT_INDEX_SUCCESS,
        data: data,
        meta: product.meta
      });
    }
  } catch (e) {
    if (e.response.status == 401) {
      yield put(logOut());
    } else {
      yield put({
        type: actionTypes.PRODUCT_INDEX_FAILURE,
        error: e.message
      });
    }
  }
}
function productActionRequest(action, id) {
  if (action == "delete") {
    return http({ path: `products/${id}`, method: "delete" }).then(
      response => response.data
    );
  } else {
    return http({ path: `products/${id}/${action}` }).then(
      response => response.data
    );
  }
}

const showItem =(id) =>{
  return(http({ path: `products/${id}` }).then(response => response.data));
};
function* showProduct({id}){
  const result = yield call(showItem, id);
  if(result){
    console.log(result)
    yield put({
      type: actionTypes.PRODUCT_SET_ITEM,
      item: result.product,
    });
    yield put({
      type: actionTypes.PRODUCT_GALLERY,
      data: result.productImage,
    });    
  }
}
const viewImage =(id) =>{
  return(http({ path: `viewImages/${id}` }).then(response => response.data));
};
function* viewImages({id}){
  const product = yield select(store => store.product);
  const result = yield call(viewImage,id);
  if(result){
    yield put({
      type: actionTypes.PRODUCT_GALLERY,
      data: result.viewImages,
    });
  }
}
const deleteImageItemRequest =(deleteImageItem)=>{
  const formData = new FormData();
  formData.append("image",deleteImageItem);
  return http({
    path: `deleteImageItem`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.data);

}
function* deleteRequest(){
  const product = yield select(store =>store.product);
  const deleteImageItem = product.deleteImage;
  const result = yield call(deleteImageItemRequest,deleteImageItem);
  if(result){
    yield put({
      type: actionTypes.PRODUCT_GALLERY,
      data: result.gallery,
    });
  }
}

const productsFrontRequest = (meta,companyId) =>
  http({
    path: `companies/${companyId}/home?${serializeQuery({
      pageSize: meta.pageSize,
      pageNumber: meta.page - 1,
    })}`
  }).then(response => response.data);

function* fetchFrontProducts({companyId}){
  yield put({type:actionTypes.PRODUCT_SET_VALUE,key:"companyId",value:companyId});
  try {
    const product = yield select(store => store.product);
    const result = yield call(productsFrontRequest, product.frontMeta,companyId);
    yield put({
      type: actionTypes.PRODUCT_FRONT_INDEX_SUCCESS,
      frontData: result.products.data,
      frontMeta: { total: result.products.total, pageTotal: result.products.last_page }
    });
    yield put({type:actionTypes.PRODUCT_SET_VALUE,key:"company",value:result.company});
  } catch (e) {
    yield put({ type: actionTypes.PRODUCT_INDEX_FAILURE, error: e.message });
  }
}
function* changeFrontPage({ page }) {
  const frontMeta = yield select(store => store.product.frontMeta);
  if (page < 0) {
    page = 0;
  }

  if (page > frontMeta.pageTotal) {
    page = frontMeta.pageTotal - 1;
  }
  yield put({ type: actionTypes.PRODUCT_FRONT_INDEX_META, frontMeta: { page: page } });
  const companyId = yield select(({product}) => product.companyId);
  yield put({ type: actionTypes.PRODUCT_FRONT_INDEX_REQUEST,companyId });
}
const showHomeProduct =(id) =>{
  return(http({ path: `products/${id}/home` }).then(response => response.data));
};
function* showFrontProduct({id}){
  const result = yield call(showHomeProduct, id);
  if(result){
    console.log(result)
    yield put({
      type: actionTypes.PRODUCT_SET_ITEM,
      item: result.product,
    });
    yield put({
      type: actionTypes.PRODUCT_SET_VALUE,
      key: 'frontData',
      value: result.products,
    });    
  }
}

export function* saga() {
  yield takeLatest(actionTypes.PRODUCT_INDEX_REQUEST, fetchProducts);
  yield takeLatest(actionTypes.PRODUCT_PAGE_CHANGED, changePage);
  yield takeLatest(actionTypes.PRODUCT_PAGESIZE_CHANGED, changePageSize);
  yield takeLatest(actionTypes.PRODUCT_SAVE_ITEM, saveItem); 
  yield takeLatest(actionTypes.PRODUCT_ACTION_REQUEST, callAction);
  yield takeLatest(actionTypes.PRODUCT_SHOW_DETAIL, showProduct);
  yield takeLatest(actionTypes.PRODUCT_VIEW_IMAGES, viewImages);
  yield takeLatest(actionTypes.PRODUCT_DELETE_IMAGE,deleteRequest);
  // yield takeLatest(actionTypes.PRODUCT_CHANGE_ITEM, changeItem);
  yield takeLeading(actionTypes.PRODUCT_FRONT_INDEX_REQUEST, fetchFrontProducts);
  yield takeLeading(actionTypes.PRODUCT_FRONT_PAGE_CHANGED, changeFrontPage);
  yield takeLeading(actionTypes.PRODUCT_FRONT_SHOW, showFrontProduct);
}