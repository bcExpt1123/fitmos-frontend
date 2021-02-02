import { handleActions } from "redux-actions";
import {
  fetchCampaign,
  fetchCampaignRequested,
  fetchCampaignSucceeded,
  fetchCampaignFailed,
  disableCampaign,
  enableCampaign
} from "./actions";

const initialState = {
  isCampaignEnabled: false,
  isCampaignBannerClosedByUser: false,
  isLoading: false,
  campaign: undefined
};

export default handleActions(
  {
    [fetchCampaign]: state => ({
      ...state,
      isLoading: true
    }),
    [fetchCampaignRequested]: state => ({
      ...state,
      campaign: undefined
    }),

    [fetchCampaignSucceeded]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      campaign: payload.campaign
    }),

    [fetchCampaignFailed]: state => ({
      ...state,
      isLoading: false
    }),

    [enableCampaign]: state => ({
      ...state,
      isCampaignEnabled: true
    }),

    [disableCampaign]: (state, { payload = {} }) => ({
      ...state,
      isCampaignEnabled: false,
      isCampaignBannerClosedByUser:
        typeof payload.byUser !== "undefined"
          ? payload.byUser
          : state.isCampaignBannerClosedByUser
    })
  },
  initialState
);
