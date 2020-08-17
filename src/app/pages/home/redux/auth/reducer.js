import { handleActions } from "redux-actions";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  updateIdToken,
  setAuthData,
  setUser,
  logOut,
  logOuting,
  initialAuth,
  deleteAuthData,
  authenticationSkipped,
  authenticationSucceeded,
  authenticationFailed,
  signInUser,
  takeFreeWorkoutCompleted,
  updateWeight,
  updateCustomerAttribute,
  regenerateCompleted,
  updateUserDetails,
} from "./actions";
import * as routerHelpers from "../../../../router/RouterHelpers";

const initialState = {
  authPerformed: false,
  currentUser: undefined,
  currentUserId: undefined,
  accessToken: undefined,
  logOuting:false,
  regenerateCompleted:true,
  expires_at: undefined
};

export default persistReducer(
  {
    storage,
    key: "fitemos-auth",
    whitelist: ["currentUser", "accessToken", "expires_at"]
  },
  handleActions(
    {
      // To make sure we have auth state initialized correctly with all fields
      // even if we restore it from cookies we extend with initialState explicitly
      "@@INIT": state => ({
        ...initialState,
        ...state
      }),

      [updateIdToken]: (state, { payload }) => ({
        ...state,
        accessToken: payload
      }),

      [setAuthData]: (state, { payload }) => ({
        ...state,
        accessToken: payload.accessToken
      }),
      [deleteAuthData]: (state, { payload }) => {
        return initialState;
      },

      [setUser]: (state, { payload }) => ({
        ...state,
        currentUser: payload,
        currentUserId: payload ? payload.id : undefined
      }),

      [signInUser]: (state, { payload }) => ({
        ...state,
        ...(payload.authentication
          ? {
              accessToken: payload.authentication.accessToken,
              expires_at: payload.authentication.expires_at
            }
          : {}),
        ...(payload.user
          ? {
              currentUser: payload.user,
              currentUserId: payload.user.id
            }
          : {})
      }),
      [updateUserDetails]:(state, { payload }) => ({
        ...state,
        ...(payload.user
          ? {
              currentUser: payload.user,
              currentUserId: payload.user.id
            }
          : {})
      }),
      [takeFreeWorkoutCompleted]: state => {
        const currentClonedUser = Object.assign({}, state.currentUser);
        currentClonedUser.has_workout_subscription = true;
        return { ...state, currentUser: currentClonedUser };
      },
      [authenticationSkipped]: state => ({
        ...state,
        authPerformed: true
      }),

      [authenticationSucceeded]: state => ({
        ...state,
        authPerformed: true
      }),

      [authenticationFailed]: state => ({
        ...state,
        authPerformed: true
      }),
      [logOuting]:state=>({
        ...state,
        logOuting:true
      }),
      [initialAuth]: () => {
        routerHelpers.forgotLastLocation();
        return initialState;
      },
      [updateWeight]: (state, { payload }) => {
        const currentClonedUser = Object.assign({}, state.currentUser);
        currentClonedUser.customer.current_weight = payload.weight;
        currentClonedUser.customer.imc = payload.imc;
        return { ...state, currentUser: currentClonedUser };
      },
      [updateCustomerAttribute]: (state, { payload }) => {
        const currentClonedUser = Object.assign({}, state.currentUser);
        currentClonedUser.customer[payload.attribute] = payload.value;
        return { ...state, currentUser: currentClonedUser };
      },
      [regenerateCompleted]:(state,{payload})=>{
        return {...state,regenerateCompleted:payload.regenerateCompleted}
      }
    },
    initialState
  )
);
