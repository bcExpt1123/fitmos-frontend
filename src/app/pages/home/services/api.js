/* eslint no-use-before-define: off */
/* eslint no-underscore-dangle: off */
import axios from "axios";
import camelCase from "lodash/camelCase";
import snakeCase from "lodash/snakeCase";
import { createRef } from 'react';
import store from "../../../store/store";

export const API_URLS = {
  bodyweight: process.env.BODYWEIGHT_API_URL,
  user: process.env.USER_API_URL,
  payment: process.env.PAYMENT_API_URL,
  messaging: process.env.MESSAGING_API_URL,
  app: process.env.REACT_APP_API_URL
};

function url(app, path) {
  return `${API_URLS["app"]}${path}`;
}

export function http({
  method = "GET",
  app,
  path = "/",
  httpUrl,
  headers = { Accept: "application/json" },
  data,
  params,
  skipAuthentication = false,
  authToken = undefined
}) {
  const config = {
    method,
    headers,
    data,
    params
  };
  if(path==false)config.url = httpUrl;
  else config.url = url(app, path);

  if (!skipAuthentication) {
    const idToken = authToken || store.getState().auth.accessToken;

    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
  }

  return axios(config);
}
export function fileDownload({
  method = "GET",
  path = "/",
  headers = { Accept: "application/json" },
  app,
  data,
  params,
  skipAuthentication = false,
}){
  const config = {
    method,
    data,
    headers,
    responseType: 'blob',
    params
  };
  config.url = url(app, path);

  if (!skipAuthentication) {
    const idToken = store.getState().auth.accessToken;

    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
  }

  return axios(config);
}
export const camelizeResponse = data =>
  Array.isArray(data)
    ? camelizeResponseArray(data)
    : camelizeResponseKeys(data);

export function camelizeResponseArray(data) {
  const result = [];
  data.forEach(v => {
    if (Array.isArray(v)) {
      result.push(camelizeResponseArray(v));
    } else if (typeof v === "object") {
      result.push(camelizeResponseKeys(v));
    } else {
      result.push(v);
    }
  });
  return result;
}

export function camelizeResponseKeys(data) {
  if (!data) return undefined;
  const result = {};
  Object.keys(data).forEach(_k => {
    const k = _k.startsWith("__") ? _k : camelCase(_k);

    if (Array.isArray(data[_k])) {
      result[k] = camelizeResponseArray(data[_k]);
    } else if (!data[_k]) {
      result[k] = data[_k];
    } else if (typeof data[_k] === "object") {
      result[k] = camelizeResponseKeys(data[_k]);
    } else {
      result[k] = data[_k];
    }
  });

  return result;
}

export function snakeReq(data) {
  if (typeof data === "string" || typeof data === "number") return data;
  return Object.keys(data).reduce((res, k) => {
    let value;
    if (Object.prototype.toString.call(data[k]) === "[object Date]") {
      value = data[k];
    } else if (Array.isArray(data[k])) {
      value = data[k].map(a => snakeReq(a));
    } else if (typeof data[k] === "object" && data[k] !== null) {
      value = snakeReq(data[k]);
    } else {
      value = data[k];
    }
    return { ...res, [snakeCase(k)]: value };
  }, {});
}
