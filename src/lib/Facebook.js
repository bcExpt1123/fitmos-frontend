const PERMISSIONS = ["public_profile", "email"];

function isAuthorized(responseStatus) {
  return responseStatus === "connected";
}

function isPermitted(grantedPermissions) {
  return grantedPermissions.indexOf("email") !== -1;
}

function getLoginStatus() {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus(response => {
      if (isAuthorized(response.status)) {
        resolve(response.authResponse.accessToken);
      } else {
        reject();
      }
    });
  });
}

function authorizeApp({ rerequest = false } = {}) {
  return new Promise((resolve, reject) => {
    window.FB.login(
      response => {
        // If app is not authorized, just reject - user closed window
        if (!isAuthorized(response.status)) {
          reject();
          return;
        }

        // If app is authorized resolve with access token
        if (isPermitted(response.authResponse.grantedScopes.split(","))) {
          resolve(response.authResponse.accessToken);
          return;
        }

        // If possible, ask again for permissions, but only once
        if (!rerequest) {
          authorizeApp({ rerequest: true }).then(resolve, reject);
        } else {
          reject();
        }
      },
      {
        scope: PERMISSIONS.join(","),
        return_scopes: true,
        auth_type: rerequest ? "rerequest" : undefined
      }
    );
  });
}

function login() {
  return getLoginStatus()
    .catch(() => authorizeApp())
    .catch(() => Promise.reject(new Error("app_not_authorized")));
}

const Facebook = {
  login
};

export default Facebook;
