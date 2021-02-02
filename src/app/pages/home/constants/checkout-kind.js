// Just like CHECKOUT_TYPE, but ACTIVATE state is split into 3 separate cases.
export const CHECKOUT_KIND = {
  PROLONG: "prolong",
  UPGRADE: "upgrade",
  ACTIVATE: "activate",
  ACTIVATE_WITH_TRIAL: "activate_with_trial",
  ACTIVATE_WITH_DISCOUNT: "activate_with_discount"
};
