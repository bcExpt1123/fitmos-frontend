import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

//import * as auth from "./ducks/auth.duck";
import * as customer from "../../modules/subscription/customer";
import * as admin from "../../modules/subscription/admin";
import * as service from "../../modules/subscription/service";
import * as transaction from "../../modules/subscription/transaction";
import * as bankTransferRequest from "../../modules/subscription/bankTransferRequest";
import * as coupon from "../../modules/subscription/coupon";
import * as linkCoupon from "../../modules/subscription/linkCoupons";
import * as subscription from "../../modules/subscription/subscription";
import * as shortcode from "../../modules/subscription/shortcode";
import * as keyword from "../../modules/subscription/keyword";
import * as invoice from "../../modules/subscription/invoice";
import * as cms from "../../modules/subscription/cms";
import * as weekWorkout from "../../modules/subscription/weekWorkout";
import * as event from "../../modules/subscription/event";
import * as category from "../../modules/subscription/category";
import * as benchmark from "../../modules/subscription/benchmark";
import * as tocken from "../../modules/subscription/tocken";
import * as cartSetting from "../../modules/subscription/cartSetting";
import * as permission from "../../modules/subscription/permission";
import * as medal from "../../modules/subscription/medal";
import * as survey from "../../modules/subscription/survey";
import * as company from "../../modules/subscription/company";
import * as product from "../../modules/subscription/product";
import * as evento from "../../modules/subscription/evento";
import { metronic } from "../../_metronic";
import alertReducer from "../pages/home/redux/alert/reducer";
import authReducer from "../pages/home/redux/auth/reducer";
import campaignReducer from "../pages/home/redux/campaign/reducer";
import checkoutReducer from "../pages/home/redux/checkout/reducer";
//import cid from './cid/reducer';
//import claims from './claims/reducer';
//import countryCode from './countryCode/reducer';
//import jobPositions from './job-positions/reducer';
//import locale from './locale/reducer';
import logInReducer from "../pages/home/redux/logIn/reducer";
import marketingConsentReducer from "../pages/home/redux/marketingConsent/reducer";
//import partnership from './partnership/reducers';
import passwordResetReducer from "../pages/home/redux/passwordReset/reducer";
//import playlists from './playlists/reducer';
//import productOffers from './productOffers/reducer';
//import messagingProfile from './messagingProfile/reducer';
//import referrer from './referrer/reducer';
import registrationReducer from "../pages/home/redux/registration/reducer";
//import resendConfirmation from './resendConfirmation/reducer';
//import userSettings from './userSettings/reducer';
import vouchersReducer from "../pages/home/redux/vouchers/reducer";
import doneReducer from "../pages/home/redux/done/reducer";
import workoutReducer from "../pages/home/redux/workout/reducer";
import peopleReducer from "../pages/home/redux/people/reducer";
import postReducer from "../pages/home/redux/post/reducer";
import notificationReducer from "../pages/home/redux/notification/reducer";

//import accountDeleted from './accountDeleted/saga';
import alert from "../pages/home/redux/alert/saga";
import auth from "../pages/home/redux/auth/saga";
import campaign from "../pages/home/redux/campaign/saga";
import checkout from "../pages/home/redux/checkout/saga";
import error from "../pages/home/redux/error/saga";
//import jobPositions from './job-positions/saga';
import logIn from "../pages/home/redux/logIn/saga";
//import logOut from '../pages/home/redux/logOut/saga';
import marketingConsent from "../pages/home/redux/marketingConsent/saga";
//import partnership from './partnership/sagas';
import passwordReset from "../pages/home/redux/passwordReset/saga";
//import playlists from './playlists/saga';
//import productOffers from './productOffers/saga';
//import messagingProfile from './messagingProfile/saga';
//import referrer from './referrer/saga';
import registration from "../pages/home/redux/registration/saga";
//import resendConfirmation from './resendConfirmation/saga';
//import setAuthTokens from './setAuthTokens/saga';
import userSettings from "../pages/home/redux/userSettings/saga";
import vouchers from "../pages/home/redux/vouchers/saga";
import done from "../pages/home/redux/done/saga";
import workout from "../pages/home/redux/workout/saga";
import people from "../pages/home/redux/people/saga";
import post from "../pages/home/redux/post/saga";
import notification from "../pages/home/redux/notification/saga";


export const rootReducer = combineReducers({
  //auth: auth.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  customer: customer.reducer,
  admin:admin.reducer,
  service: service.reducer,
  transaction: transaction.reducer,
  bankTransferRequest:bankTransferRequest.reducer,
  coupon: coupon.reducer,
  linkCoupon: linkCoupon.reducer,
  subscription: subscription.reducer,
  shortcode: shortcode.reducer,
  keyword: keyword.reducer,
  invoice: invoice.reducer,
  cms: cms.reducer,
  weekWorkout:weekWorkout.reducer,
  category: category.reducer,
  event: event.reducer,
  evento: evento.reducer,
  benchmark: benchmark.reducer,
  tocken: tocken.reducer,
  cartSetting:cartSetting.reducer,
  permission:permission.reducer,
  medal:medal.reducer,
  campaign: campaignReducer,
  marketingConsent: marketingConsentReducer,
  registration: registrationReducer,
  alert: alertReducer,
  logIn: logInReducer,
  passwordReset: passwordResetReducer,
  auth: authReducer,
  checkout: checkoutReducer,
  vouchers: vouchersReducer,
  done: doneReducer,
  workout: workoutReducer,
  survey: survey.reducer,
  company: company.reducer,
  product: product.reducer,
  people:peopleReducer,
  post:postReducer,
  notification:notificationReducer,
});

export function* rootSaga() {
  yield all([
    //auth.saga(),
    customer.saga(),
    admin.saga(),
    service.saga(),
    transaction.saga(),
    bankTransferRequest.saga(),
    coupon.saga(),
    linkCoupon.saga(),
    subscription.saga(),
    shortcode.saga(),
    keyword.saga(),
    invoice.saga(),
    cms.saga(),
    weekWorkout.saga(),
    category.saga(),
    event.saga(),
    evento.saga(),
    benchmark.saga(),
    tocken.saga(),
    cartSetting.saga(),
    permission.saga(),
    medal.saga(),
    campaign(),
    error(),
    //logOut(),
    marketingConsent(),
    registration(),
    alert(),
    logIn(),
    passwordReset(),
    auth(),
    userSettings(),
    checkout(),
    vouchers(),
    done(),
    workout(),
    people(),
    post(),
    notification(),
    survey.saga(),
    company.saga(),
    product.saga(),
  ]);
}
