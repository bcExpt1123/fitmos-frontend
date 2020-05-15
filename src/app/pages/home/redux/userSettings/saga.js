import {
  call,
  delay,
  put,
  takeLatest,
  takeLeading,
  select,
  spawn
} from "redux-saga/effects";
import { addAlertMessage } from "../alert/actions";
//import { setUser } from '../auth/actions';
//import { logError } from '../../lib/logError';
import { http } from "../../services/api";
import { updateProfile, updateAdminProfile, updateEmail } from "./actions";
import { authenticate as regenerateAuthAction } from "../auth/actions";
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
  formData.append("email", params.email);
  formData.append("customer_email", params.customer_email);
  formData.append("active_email", params.active_email ? 1 : 0);
  formData.append("active_whatsapp", params.active_whatsapp ? 1 : 0);
  formData.append("whatsapp_phone_number", params.whatsapp_phone_number);
  formData.append("country", params.country);
  formData.append("country_code", params.country_code);
  if (params.password) {
    formData.append("password", params.password);
    formData.append("confirm_password", params.confirm_password);
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
        errors.email == "The email has already been taken."
      ) {
        errors.email = "El correo electrónico ha sido deplicado.";
      }
      if (
        errors &&
        errors.customer_email &&
        errors.customer_email == "The email has already been taken."
      ) {
        errors.customer_email = "El correo electrónico ha sido deplicado.";
      }
      if(errors &&
        errors.whatsapp_phone_number &&
        errors.whatsapp_phone_number == "invalid"
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
      message: { id: "SettingsForm.Profile.success_update_settings" }
    };
    if (params.email) {
      alertMessage.message.id = "SettingsForm.Profile.success_update_email";
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
  let success = false;

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateAdminUserProfile, params);
    success = true;
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
      message: { id: "SettingsForm.Profile.success_update_settings" }
    };
    if (params.email) {
      alertMessage.message.id = "SettingsForm.Profile.success_update_email";
    }
    yield put(addAlertMessage(alertMessage));
  }
  // yield put profile udate action
  yield put(regenerateAuthAction());
}
const updateUserEmail = params => {
  return http({ path: `users/email`, method: "PUT", data: params });
};
export function* onUpdateEmail({ payload: { params, resolve, reject } }) {
  let errors = {};
  let success = false;

  // eslint-disable-next-line no-restricted-syntax
  try {
    // eslint-disable-next-line no-continue
    if (!params) return;

    // TODO: refactor UserApi, so snakeReq will be called there.
    yield call(updateUserEmail, params);
    success = true;
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
        errors.email == "The email has already been taken."
      ) {
        errors.email = "El correo electrónico ha sido deplicado.";
      }
      if(errors &&
        errors.whatsapp_phone_number &&
        errors.whatsapp_phone_number == "invalid"
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
      message: { id: "SettingsForm.Profile.success_update_settings" }
    };
    if (params.email) {
      alertMessage.message.id = "SettingsForm.Profile.success_update_email";
    }
    yield put(addAlertMessage(alertMessage));
  }
  // yield put profile udate action
  yield put(regenerateAuthAction());
}

export default function* rootSaga() {
  yield takeLeading(updateProfile, onUpdateProfile);
  yield takeLeading(updateAdminProfile, onUpdateAdminProfile);
  yield takeLeading(updateEmail, onUpdateEmail);
}
