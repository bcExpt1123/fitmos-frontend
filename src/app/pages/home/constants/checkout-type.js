export const CHECKOUT_TYPE = {
  // Purchase (immediately or later, in case of a trial) and agree to recurring
  // payments
  ACTIVATE: 0,
  // Only agree to recurring payments
  PROLONG: 1,
  // Upsell (any product to T+N+M bundle)
  UPGRADE: 2
};
