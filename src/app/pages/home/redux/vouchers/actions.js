import { createActions } from "redux-actions";

export const {
  validateVoucher,
  validateVoucherFailed,
  validateVoucherSucceeded,
  initialVoucher,
  setPrivateVoucher,
  generateFirstPayVoucher,
  setPublicVoucher,
  setReferralVoucher,
  createRenewalVoucher,
  checkVoucher
} = createActions(
  "VALIDATE_VOUCHER",
  "VALIDATE_VOUCHER_FAILED",
  "VALIDATE_VOUCHER_SUCCEEDED",
  "INITIAL_VOUCHER",
  "SET_PRIVATE_VOUCHER",
  "GENERATE_FIRST_PAY_VOUCHER",
  "SET_PUBLIC_VOUCHER",
  "SET_REFERRAL_VOUCHER",
  "CREATE_RENEWAL_VOUCHER",
  "CHECK_VOUCHER",
  { prefix: "VOUCHERS" }
);
