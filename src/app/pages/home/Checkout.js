import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import StepPayment from "./CheckoutPage/StepPayment";
import { initialVoucher,checkVoucher,generateFirstPayVoucher } from "./redux/vouchers/actions";
import { checkPaymentMode, changeVoucher,inside,outside, start } from "./redux/checkout/actions";
// import { findUserDetails } from "./redux/auth/actions";
import { reactLocalStorage } from 'reactjs-localstorage';
import { calculatePriceWithCoupon } from '../../../lib/calculatePrice';
import "./assets/scss/theme/style.scss";
import "./assets/scss/theme/mbr-additional.css";
import "./assets/scss/dropdown/style.css";
import "./assets/scss/theme/common.scss";
import "./assets/scss/theme/login.scss";
import "./assets/scss/theme/signup.scss";

const styles = {page:"checkout-section"};
const CheckoutPage = () => {
  const history = useHistory();
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  const frequency = useSelector(({service})=>service.frequency);
  const activePlan = useSelector(({service})=>service.activePlan)
  const bankFee = useSelector(({service})=>service.item.bank_fee);
  const coupons = useSelector(({vouchers})=>vouchers);
  const paymentType = useSelector(({service})=>service.type);
  const bankRenewal = useSelector(({checkout})=>checkout.bank.renewal);
  // referrer or campaign.
  const [enteredVoucher, setEnteredVoucher] = useState(() => {
    const values = Object.values(coupons);
    if (values[0] && values[0].discount) return values[0];
    return false;
  });
  //const [removeCoupon,setRemoveCoupon] = useState(false);
  useEffect(() => {
    const values = Object.values(coupons);
    if (values[0] && values[0].discount) {
      setEnteredVoucher(values[0]);
    }else{
      //if(!currentUser.has_workout_subscription){
        //if(!removeCoupon)generateFirstPayVoucher();
      //}  
    }
  },[coupons]);
  const dispatch = useDispatch();
  useEffect(() => {
    // if(paymentType==="bank")dispatch(findUserDetails());
    reactLocalStorage.set('checkout', true);
    dispatch(inside({activePlan}));
    dispatch(checkVoucher());
    dispatch(checkPaymentMode());// check testing or production on payment
    return () => {
      dispatch(outside());
    };
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if(currentUser.has_workout_subscription && currentUser.has_active_workout_subscription &&  !bankRenewal ){
      console.log(bankRenewal)
      history.push("/");
      dispatch(start());
    }
  },[currentUser]);

  // Voucher entered manually by user via voucher form, or from query params,
  if (activePlan === null) {
    history.push("/pricing");
    return null;
  }

  const service = "workout";
  let checkoutType = 1;
  if(activePlan)checkoutType = 2;
  const vouchers = {
    workout: {
      "3-months": ""
    }
  };

  const currentUrl = window.location.pathname;

  /*const [selectedProduct, setSelectedProduct] = useState(
        false
    );*/
  const selectedProduct = {
    id: "1",
    platform: "web",
    //amount_cents: 209850,
    //recurring_amount_cents: 209850,
    currency: "USD",
    currency_exponent: 2,
    interval: activePlan,
    type: "workout",
    country: "pa",
    months: frequency,
    active: true,
    discount_percentage: 0,
    free_trial_length: 0
  };

  let pricing;
  if(paymentType === 'bank'){
    pricing = {
      initialPrices: { total: (parseFloat(serviceItem[activePlan])+parseFloat(bankFee)) * 100 },
      originalPrices: undefined,
      discountedPrices: { total: (parseFloat(serviceItem[activePlan])+parseFloat(bankFee)) * 100 },
      recurringPrices: { total: (parseFloat(serviceItem[activePlan])+parseFloat(bankFee)) * 100 },
      refundAmountCents: undefined,
      currentSubscriptionsAmountCents: undefined,
      bundlePrices: { total: (parseFloat(serviceItem[activePlan])+parseFloat(bankFee)) * 100 }
    };    
  }else{
    pricing = {
      initialPrices: { total: serviceItem[activePlan] * 100 },
      originalPrices: undefined,
      discountedPrices: { total: serviceItem[activePlan] * 100 },
      recurringPrices: { total: serviceItem[activePlan] * 100 },
      refundAmountCents: undefined,
      currentSubscriptionsAmountCents: undefined,
      bundlePrices: { total: serviceItem[activePlan] * 100 }
    };
  }
  /*eslint-disable no-mixed-operators*/
  if (enteredVoucher && (!currentUser.has_workout_subscription || currentUser.has_workout_subscription && (enteredVoucher.renewal === '1' || enteredVoucher.renewal === 1))) {
    pricing.appliedVoucher = enteredVoucher;
    pricing.savingsInPercent = enteredVoucher.discount;
    const pricingWithCoupon = calculatePriceWithCoupon(paymentType,serviceItem[activePlan],bankFee,enteredVoucher);
    pricing.discountedPrices.total = pricingWithCoupon[0];
    if(pricingWithCoupon[1])pricing.recurringPrices.total = pricingWithCoupon[1];
  }
  // in case of user is navigating to some other page PE-14498 fix
  // this part of the fix prevents rendering of checkout 1st step
  // during transition to the new URL
  if (currentUrl.split("/")[1] !== "checkout") return null;

  const onEnteredVoucherChange = newEnteredVoucher => {
    setEnteredVoucher(newEnteredVoucher);
    dispatch(changeVoucher());
  };

  const resetActiveVoucher = () => {
    dispatch(initialVoucher());
    setEnteredVoucher(undefined);
    //setRemoveCoupon(true);
    dispatch(changeVoucher());
  };

  return (
    <>
      <MetaTags>
        <title>Checkout -Fitemos </title>
        <meta name="description" content="Página de pago Fitemos." />
      </MetaTags>

      <article className={styles.page}>
        <NavBar variant="lite" checkout={true} isScroll={false}/>
        <StepPayment
          service={service}
          checkoutType={checkoutType}
          pricing={pricing}
          enteredVoucher={enteredVoucher}
          selectedProduct={selectedProduct}
          vouchers={vouchers}
          paymentType={paymentType}
          onEnteredVoucherChange={onEnteredVoucherChange}
          resetActiveVoucher={resetActiveVoucher}
        />
        <Footer  checkout={true} />
      </article>
    </>
  );
};

export default CheckoutPage;