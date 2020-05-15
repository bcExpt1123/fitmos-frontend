const { REACT_APP_GOOGLE_SIGNIN_CLIENT_ID } = process.env;
let loadingPromise;

/*
 * Return instance of GoogleAuth object
 *
 * WARNING!
 * this funciton cannot be used in promise, because returned instance is `thenable` itself,
 * and in each `then` call it returns itself, causing infinite loop!
 * Never user GoogleAuth as return value in promise!
 */
function getGoogleAuth() {
  return window.gapi.auth2.getAuthInstance();
}

function initGoogleAuth() {
  const { auth2 } = window.gapi;

  // we cannot return auth.init.then's result as promise result,
  // docs says it will call infinite loop
  return new Promise((resolve, reject) => {
    auth2
      .init({
        client_id: REACT_APP_GOOGLE_SIGNIN_CLIENT_ID
      })
      .then(() => {
        resolve();
      }, reject);
  });
}

function loadAuth2() {
  return new Promise(resolve => {
    window.gapi.load("auth2", () => {
      resolve();
    });
  });
}

/*
 * Helper function,
 *
 * To be safe before overriding global funciton we store previous value,
 * and when callback is called, we restore previous value (clearing our value out)
 * and call it if it was function.
 */
function registerGlobalCallback(name) {
  return new Promise(resolve => {
    const oldFn = window[name];
    window[name] = (...args) => {
      window[name] = oldFn;
      if (window[name]) {
        try {
          window[name].apply(this, args);
        } catch {
          /* noop */
        }
      }
      resolve(args);
    };
  });
}

function loadAsynchronously(id = "google-gapi-sdk") {
  if (document.getElementById(id)) {
    return;
  }

  const element = document.getElementsByTagName("script")[0];
  const js = document.createElement("script");
  js.id = id;
  js.src = "https://apis.google.com/js/platform.js";
  js.async = true;
  js.defer = true;
  element.parentNode.insertBefore(js, element);
}

function waitForGoogleAuth() {
  if (typeof window.gapi === "undefined") {
    loadAsynchronously();
    return registerGlobalCallback("gapi_onload").then(() => loadAuth2());
  }
  return loadAuth2();
}

function load() {
  if (typeof loadingPromise === "undefined") {
    loadingPromise = waitForGoogleAuth().then(initGoogleAuth);
  }
  return loadingPromise;
}

/*
 * Signs user into application
 *
 * https://developers.google.com/identity/sign-in/web/reference#googleusergetauthresponseincludeauthorizationdata
 * returns AuthResponse object:
 *   //access_token (string)
 *   id_token (string)
 *   login_hint (string)
 *   //scope (string)
 *   expires_in (string)
 *   first_issued_at (string)
 *   expires_at (string)
 */
const logIn = () =>
  load()
    .then(() => getGoogleAuth().signIn({ prompt: "select_account" }))
    .then(() => getGoogleAuth().currentUser.get())
    .then(googleUser => googleUser.getAuthResponse());
const disconnect = () => load().then(() => getGoogleAuth().disconnect());

export default { load, logIn, disconnect };
