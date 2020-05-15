import { createActions } from "redux-actions";

export const {
  fetchCampaign,
  fetchCampaignRequested,
  fetchCampaignSucceeded,
  fetchCampaignFailed,
  disableCampaign,
  enableCampaign
} = createActions(
  "FETCH_CAMPAIGN",
  "FETCH_CAMPAIGN_REQUESTED",
  "FETCH_CAMPAIGN_SUCCEEDED",
  "FETCH_CAMPAIGN_FAILED",
  "DISABLE_CAMPAIGN",
  "ENABLE_CAMPAIGN",
  { prefix: "CAMPAIGN" }
);
