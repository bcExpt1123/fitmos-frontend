import { http } from "./api";

const get = () => {
  return http({
    app: "user",
    path: "/users"
  }).then(response => response.data.user);
};

const update = params => {
  return http({
    app: "user",
    path: "/v2/profile.json",
    method: "PATCH",
    data: {
      user: params
    }
  }).then(response => response.data.user);
};

export { get, update };
