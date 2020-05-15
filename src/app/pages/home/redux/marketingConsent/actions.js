import { createActions } from "redux-actions";

export const {
  setMarketingConsent,
  grantMarketingConsent,
  declineMarketingConsent,
  marketingConsentUpdated
} = createActions(
  "SET_MARKETING_CONSENT",
  "GRANT_MARKETING_CONSENT",
  "DECLINE_MARKETING_CONSENT",
  "MARKETING_CONSENT_UPDATED",
  { prefix: "MARKETING_CONSENT" }
);
