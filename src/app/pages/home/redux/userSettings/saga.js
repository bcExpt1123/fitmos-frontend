import {
  call,
  put,
  takeLeading,
} from "redux-saga/effects";
import { addAlertMessage } from "../alert/actions";
//import { setUser } from '../auth/actions';
//import { logError } from '../../lib/logError';
import { http } from "../../services/api";
import { 
  updateProfile, 
  updateAdminProfile, 
  updateEmail, 
  updateOnlyEmail,
  updatePassword,
  uploadProfileImage,
  deleteProfileImage,
  triggerWorkout, 
  triggerNotifiable,
  removeGoogle,
  signInWithGoogle,
  removeFacebook,
  signInWithFacebook
 } from "./actions";
import { authenticate as regenerateAuthAction,regenerateCompleted,updateUserDetails } from "../auth/actions";
import { startProfileImageUploading } from "../done/actions";
import Facebook from "../../../../../lib/Facebook";
import Google from "../../../../../lib/Google";

const flattenErrors = errObj =>
  Object.keys(errObj).reduce(
    (res, key) => ({
      ...res,
      [key]: errObj[key]
        // TODO: convert codes to translation keys. { id: ... }
        // It requires a lot of translations, should be done later.
        .map(err =>
          typeof err === "string" ? err : Object.values(err).join(", ")
        )
        .join(", ")
    }),
    {}
  );
const updateUserProfile = params => {
  const formData = new FormData();
  formData.append("first_name", params.first_name);
  formData.append("last_name", params.last_name);
  //formData.append("email", params.email);
  //formData.append("customer_email", params.customer_email);
  //formData.append("active_email", params.active_email ? 1 : 0);
  //formData.append("active_whatsapp", params.active_whatsapp ? 1 : 0);
  formData.append("whatsapp_phone_number", params.whatsapp_phone_number);
  formData.append("country", params.country);
  formData.append("country_code", params.country_code);
  formData.append("current_height",params.current_height);
  formData.append("gender",params.gender);
  formData.append("description",params.description);
  if (params.password) {
    //formData.append("password", params.password);
    //formData.append("confirm_password", params.confirm_password);
  }
  if (params.image) {
    params.image.forEach((file, i) => {
      formData.append("image", file);
    });
  }
  return http({
    path: `users/customerUpdate`,
    method: "POST",
    data: formData,
    headers: {
      "content-type": "multipart/form-data"
    }
  });
};
// saga-like update implementation.
// idea is to collect all errors/successes and then fetch updated objects and fill 422 form errors
// but there are no cancelation actions, so it's not a proper saga :)
// for .. of can be refactored into separate functions and yield*, but in this case
// code will look more ugly
export function* onUpdateProfile({ payload: { params, resolve, reject } }) {
  let errors = {};
  let success = false;

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateUserProfile, params);
    success = true;
  } catch (error) {
    if (error.response.status === 422) {
      errors =
        // 422 responses are different (depends on api), can be codes or errors
        flattenErrors(
          error.response.data.errors || error.response.data.codes || {}
        );
      if (
        errors &&
        errors.email &&
        errors.email === "The email has already been taken."
      ) {
        errors.email = "El correo electrónico ha sido deplicado.";
      }
      if (
        errors &&
        errors.customer_email &&
        errors.customer_email === "The email has already been taken."
      ) {
        errors.customer_email = "El correo electrónico ha sido deplicado.";
      }
      if(errors &&
        errors.whatsapp_phone_number &&
        errors.whatsapp_phone_number === "invalid"
        ){
          errors.whatsapp_phone_number = "el número de whatsapp no es válido";
          yield put(addAlertMessage({
            type: "error",
            message: errors.whatsapp_phone_number
          }));       
        }
      console.log(errors);
    } else {
      errors.generic = true;
    }
  }

  if (Object.keys(errors).length) {
    reject(errors);
    // FIXME: show alert messages for email and password updates?
    if (errors.generic) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "PreferencesPage.Error.Api.error" }
        })
      );
    }
    // TODO: should be removed after the proper field error implementation (translations)
    if (errors.email) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Email" }
        })
      );
    }
    if (errors.password) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Settings" }
        })
      );
    }
  } else {
    resolve();
    const alertMessage = {
      type: "success",
      message: { id: "SettingsForm.Profile.Success.Update.Settings" }
    };
    if (params.email) {
      alertMessage.message.id = "SettingsForm.Profile.Success.Update.Email";
    }
    yield put(addAlertMessage(alertMessage));
  }
  // yield put profile udate action
  if(success)yield put(regenerateAuthAction());
}
const updateAdminUserProfile = params => {
  return http({ path: `users/` + params.id, method: "PUT", data: params });
};
export function* onUpdateAdminProfile({
  payload: { params, resolve, reject }
}) {
  let errors = {};

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateAdminUserProfile, params);
  } catch (error) {
    if (error.response.status === 422) {
      console.log(error.response.data.errors);
      errors =
        // 422 responses are different (depends on api), can be codes or errors
        flattenErrors(
          error.response.data.errors || error.response.data.codes || {}
        );
    } else {
      errors.generic = true;
    }
  }

  if (Object.keys(errors).length) {
    reject(errors);
    // FIXME: show alert messages for email and password updates?
    if (errors.generic) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "PreferencesPage.Error.Api.error" }
        })
      );
    }
    // TODO: should be removed after the proper field error implementation (translations)
    if (errors.email) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Email" }
        })
      );
    }
    if (errors.password) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Settings" }
        })
      );
    }
    if (errors.current_password) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Settings.current_password_failed" }
        })
      );
    }
  } else {
    resolve();
    const alertMessage = {
      type: "success",
      message: { id: "SettingsForm.Profile.Success.Update.Settings" }
    };
    if (params.email) {
      alertMessage.message.id = "SettingsForm.Profile.Success.Update.Email";
    }
    yield put(addAlertMessage(alertMessage));
  }
  // yield put profile udate action
  yield put(regenerateAuthAction());
}
const updateUserEmail = params => {
  return http({ path: `users/email`, method: "PUT", data: params });
};
function* onUpdateEmail({ payload: { params, resolve, reject } }) {
  let errors = {};

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateUserEmail, params);
  } catch (error) {
    if (error.response.status === 422) {
      console.log(error.response.data.errors);
      errors =
        // 422 responses are different (depends on api), can be codes or errors
        flattenErrors(
          error.response.data.errors || error.response.data.codes || {}
        );
      if (
        errors &&
        errors.email &&
        errors.email === "The email has already been taken."
      ) {
        errors.email = "El correo electrónico ha sido deplicado.";
      }
      if(errors &&
        errors.whatsapp_phone_number &&
        errors.whatsapp_phone_number === "invalid"
        ){
          errors.whatsapp_phone_number = "Inválido. ¿Su código de país?";
        }
    } else {
      errors.generic = true;
    }
  }

  if (Object.keys(errors).length) {
    reject(errors);
    // FIXME: show alert messages for email and password updates?
    if (errors.generic) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "PreferencesPage.Error.Api.error" }
        })
      );
    }
    // TODO: should be removed after the proper field error implementation (translations)
    if (errors.email) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Email" }
        })
      );
    }
  } else {
    resolve();
    const alertMessage = {
      type: "success",
      message: { id: "SettingsForm.Profile.Success.Update.Settings" }
    };
    if (params.email) {
      alertMessage.message.id = "SettingsForm.Profile.Success.Update.Email";
    }
    yield put(addAlertMessage(alertMessage));
  }
  // yield put profile udate action
  yield put(regenerateAuthAction());
}
const updateUserOnlyEmail = params => {
  return http({ path: `users/email-only`, method: "PUT", data: params });
};
function* onUpdateOnlyEmail({ payload: { params, resolve, reject } }) {
  let errors = {};
  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateUserOnlyEmail, params);
  } catch (error) {
    if (error.response.status === 422) {
      console.log(error.response.data.errors);
      errors =
        // 422 responses are different (depends on api), can be codes or errors
        flattenErrors(
          error.response.data.errors || error.response.data.codes || {}
        );
      if (
        errors &&
        errors.email &&
        errors.email === "The email has already been taken."
      ) {
        errors.email = "El correo electrónico ha sido deplicado.";
      }
    } else {
      errors.generic = true;
    }
  }

  if (Object.keys(errors).length) {
    reject(errors);
    // FIXME: show alert messages for email and password updates?
    if (errors.generic) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "PreferencesPage.Error.Api.error" }
        })
      );
    }
    // TODO: should be removed after the proper field error implementation (translations)
    if (errors.email) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "SettingsForm.Error.Email" }
        })
      );
    }
  } else {
    resolve();
    const alertMessage = {
      type: "success",
      message: { id: "SettingsForm.Profile.Success.Update.Email" }
    };
    yield put(addAlertMessage(alertMessage));
  }
  // yield put profile udate action
  yield put(regenerateAuthAction());
}
function uploadProfileImageOnBackend(params){
  const formData = new FormData();
  formData.append("image", params.image);
  return http({
    path: `users/upload-image`,
    method: "POST",
    data: formData,
    headers: {
      "content-type": "multipart/form-data"
    }
  });
}
function* onUploadProfileImage({payload:{image}}){
  let errors = {};

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!image) return;

    yield put(startProfileImageUploading());
    yield call(uploadProfileImageOnBackend, {image});
    yield put(regenerateAuthAction());
  } catch (error) {
    console.log(error)
    if (error.response.status === 422) {
      console.log(error.response.data.errors);
      errors =
        // 422 responses are different (depends on api), can be codes or errors
        flattenErrors(
          error.response.data.errors || error.response.data.codes || {}
        );
    } else {
      errors.generic = true;
    }
  }

  if (Object.keys(errors).length) {
    // FIXME: show alert messages for email and password updates?
    if (errors.generic) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "PreferencesPage.Error.Api.error" }
        })
      );
    }
  } else {
    const alertMessage = {
      type: "success",
      message: { id: "SettingsForm.Profile.Success.Update.Profile.Image" }
    };
    yield put(addAlertMessage(alertMessage));
  }
}
const updateUserPassword = params => {
  return http({ path: `users/update-password`, method: "PUT", data: params });
};
function* onUpdatePassword({ payload: { params, resolve, reject } }) {
  let errors = {};

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateUserPassword, params);
  } catch (error) {
    if (error.response.status === 422) {
      console.log(error.response.data.errors);
      errors =
        // 422 responses are different (depends on api), can be codes or errors
        flattenErrors(
          error.response.data.errors || error.response.data.codes || {}
        );
    } else {
      errors.generic = true;
    }
  }

  if (Object.keys(errors).length) {
    reject(errors);
    // FIXME: show alert messages for email and password updates?
    if (errors.generic) {
      yield put(
        addAlertMessage({
          type: "error",
          message: { id: "PreferencesPage.Error.Api.error" }
        })
      );
    }
  } else {
    resolve();
    const alertMessage = {
      type: "success",
      message: { id: "SettingsForm.Profile.Success.Update.Password" }
    };
    yield put(addAlertMessage(alertMessage));
  }
}
function deleteAvatar(){
  return http({ path: `users/avatar`, method: "DELETE"});
}
function* onDeleteProfileImage(){
  try {
    yield call(deleteAvatar);
    yield put(regenerateAuthAction());
  } catch (error) {
  }  
}
function triggerWorkoutAction(){
  return http({ path: `customers/trigger-workout`, method: "POST"});
}
function* onTriggerWorkout(){
  try {
    yield call(triggerWorkoutAction);
    yield put(regenerateCompleted({regenerateCompleted:false}));
    yield put(regenerateAuthAction());
    yield put(regenerateCompleted({regenerateCompleted:true}));
  } catch (error) {
  } 
}
function triggerNotifiableAction(){
  return http({ path: `customers/trigger-notifiable`, method: "POST"});
}
function* onTriggerNotifiable(){
  try {
    yield call(triggerNotifiableAction);
    yield put(regenerateCompleted({regenerateCompleted:false}));
    yield put(regenerateAuthAction());
    yield put(regenerateCompleted({regenerateCompleted:true}));
  } catch (error) {
  } 
}
function removeGoogleAction(){
  return http({ path: `users/google`, method: "DELETE"});
}
function* onRemoveGoogle(){
  try {
    yield call(removeGoogleAction);
    yield put(regenerateAuthAction());
  } catch (error) {
  } 
}
function googleLogin(googleUser){
  return http({
    method: "POST",
    path: "users/google",
    data: googleUser
  });
}
function* onLoginWithGoogle(){
  let googleUser;
  try {
    googleUser = yield call(Google.logIn);
  } catch (error) {
    return;// { error: getGoogleErrorMessage(error) };
  }

  try {
    const response = yield call(googleLogin, { id_token: googleUser.id_token });
    yield put(
      updateUserDetails({
        user:response.data.user
      })
    );
  } catch (error) {
    console.log(error)
    switch (error.response.status) {
      case 423:
        //return { error: registerError };
      default:
        //return { error: getApiErrorMessage(error) };
    }
  }
  //return { response };
}
function removeFacebookAction(){
  return http({ path: `users/facebook`, method: "DELETE"});
}
function* onRemoveFacebook(){
  try {
    yield call(removeFacebookAction);
    yield put(regenerateAuthAction());
  } catch (error) {
  } 
}
function facebookLogin(facebookUser){
  return   http({
    method: "POST",
    path: "users/facebook",
    data: facebookUser,
    skipAuthentication: true
  });
}
function* onLogInWithFacebook(){
  let accessToken;
  try {
    accessToken = yield call(Facebook.login);
  } catch (error) {
    console.log(error)
    return;// { error: getFacebookErrorMessage(error) };
  }

  try {
    const { data } = yield call(facebookLogin, { id_token: accessToken });
    yield put(
      updateUserDetails({
        user:data.user
      })
    );
  } catch (error) {
    switch (error.response.status) {
      case 423:
        console.log("423");console.log(error)  
      case 421:case "421":
        console.log("421");console.log(error)  
        yield put(addAlertMessage({ type: "error", message: "Esta cuenta de facebook ya está asociada con otra cuenta de Fitemos." }));
      default:
        //console.log(error)  
    }
  }
}
export default function* rootSaga() {
  yield takeLeading(updateProfile, onUpdateProfile);
  yield takeLeading(updateAdminProfile, onUpdateAdminProfile);
  yield takeLeading(updateEmail, onUpdateEmail);
  yield takeLeading(updateOnlyEmail, onUpdateOnlyEmail);
  yield takeLeading(uploadProfileImage,onUploadProfileImage);
  yield takeLeading(deleteProfileImage,onDeleteProfileImage);
  yield takeLeading(updatePassword, onUpdatePassword);
  yield takeLeading(triggerWorkout, onTriggerWorkout);
  yield takeLeading(triggerNotifiable,onTriggerNotifiable);
  yield takeLeading(removeGoogle, onRemoveGoogle);
  yield takeLeading(signInWithGoogle, onLoginWithGoogle)
  yield takeLeading(removeFacebook, onRemoveFacebook);
  yield takeLeading(signInWithFacebook, onLogInWithFacebook);
}
