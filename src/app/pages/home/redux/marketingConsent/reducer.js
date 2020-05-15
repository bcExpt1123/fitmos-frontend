import { handleActions } from "redux-actions";
import {
  grantMarketingConsent,
  declineMarketingConsent,
  marketingConsentUpdated,
  setMarketingConsent
} from "./actions";

const initialState = {
  marketingConsent: null,
  isSubmitting: false
};

export default handleActions(
  {
    [setMarketingConsent]: (state, { payload }) => ({
      ...state,
      marketingConsent: payload
    }),

    [grantMarketingConsent]: state => ({
      ...state,
      marketingConsent: true,
      isSubmitting: true
    }),

    [declineMarketingConsent]: state => ({
      ...state,
      marketingConsent: false,
      isSubmitting: true
    }),

    [marketingConsentUpdated]: (state, { payload }) => ({
      ...state,
      marketingConsent: payload.marketingConsent,
      isSubmitting: false
    })
  },
  initialState
);
