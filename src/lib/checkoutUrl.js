const states = {};
//import { brandToCheckoutSlug } from '../constants/brands';

export const checkoutUrl = ({
  brand,
  voucherToken,
  referrerId,
  showHero = false,
  step,
  interval,
  ...rest
}) => {
  const queryParams = {
    // compatibility with tests that rely on params order :(
    interval,
    hero: showHero ? undefined : 0,
    step: step || (brand && interval ? 2 : 1),
    voucher: voucherToken,
    referral_id: referrerId,
    ...rest
  };

  return states.checkout.index({
    brand: "brand",
    ...queryParams
  });
};
