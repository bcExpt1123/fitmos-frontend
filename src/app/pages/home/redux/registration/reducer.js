import { handleActions } from "redux-actions";
import {
  initialize,
  setStep,
  registrationFailed,
  registrationRequested,
  registrationSucceeded
} from "./actions";
//import { REGISTRATION_STEPS } from '../../constants/registration-steps';

const initialState = {
  isRegistering: false,
  user: null, // newly registered user
  provider: null // email, google, facebook
  //step: REGISTRATION_STEPS.FORM,
};

export default handleActions(
  {
    [initialize]: () => ({
      ...initialState
    }),

    [setStep]: (state, { payload }) => ({
      ...state,
      step: payload
    }),

    [registrationRequested]: state => ({
      ...state,
      isRegistering: true
    }),

    [registrationSucceeded]: (state, { payload: { provider, user } }) => ({
      ...state,
      isRegistering: false,
      user,
      provider
    }),

    [registrationFailed]: state => ({
      ...state,
      isRegistering: false
    })
  },
  initialState
);
