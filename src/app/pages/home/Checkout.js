import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect,useDispatch, useSelector } from "react-redux";
import { injectIntl } from "react-intl";
import MetaTags from "react-meta-tags";
import { useHistory } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import StepPayment from "./CheckoutPage/StepPayment";
import { initialVoucher,checkVoucher,generateFirstPayVoucher } from "./redux/vouchers/actions";
import { checkPaymentMode, changeVoucher,inside,outside } from "./redux/checkout/actions";
import {reactLocalStorage} from 'reactjs-localstorage';

const styles = {};
const CheckoutPage = () => {
  const history = useHistory();
  const currentUser = useSelector(({auth})=>auth.currentUser);
  const serviceItem = useSelector(({service})=>service.item);
  const frequency = useSelector(({service})=>service.frequency);
  const activePlan = useSelector(({service})=>service.activePlan)
  const bankFee = useSelector(({service})=>service.item.bank_fee);
  const coupons = useSelector(({vouchers})=>vouchers);
  const paymentType = useSelector(({service})=>service.type);
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
    reactLocalStorage.set('checkout', true);
    dispatch(inside({activePlan}));
    dispatch(checkVoucher());
    dispatch(checkPaymentMode());// check testing or production on payment
    return () => {
      dispatch(outside());
    };
  },[]);// eslint-disable-line react-hooks/exhaustive-deps
  

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
      initialPrices: { total: (serviceItem[activePlan]+bankFee) * 100 },
      originalPrices: undefined,
      discountedPrices: { total: (serviceItem[activePlan]+bankFee) * 100 },
      recurringPrices: { total: (serviceItem[activePlan]+bankFee) * 100 },
      refundAmountCents: undefined,
      currentSubscriptionsAmountCents: undefined,
      bundlePrices: { total: (serviceItem[activePlan]+bankFee) * 100 }
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
    if(paymentType === 'bank'){
      if(enteredVoucher.form === '%'){
        pricing.discountedPrices.total = Math.round(((serviceItem[activePlan]+bankFee) * 100 * (100 - pricing.savingsInPercent)) / 100);
        if(enteredVoucher.renewal === '1' || enteredVoucher.renewal === 1)pricing.recurringPrices.total = Math.round(((serviceItem[activePlan]+bankFee) * 100 * (100 - pricing.savingsInPercent)) / 100);
      }
      else {
        pricing.discountedPrices.total = parseFloat(pricing.discountedPrices.total) - parseFloat(enteredVoucher.discount)*100;
        if(pricing.discountedPrices.total<0)pricing.discountedPrices.total = 0;
        if(enteredVoucher.renewal === '1' || enteredVoucher.renewal === 1)pricing.recurringPrices.total = pricing.discountedPrices.total;
      }
    }else{
      if(enteredVoucher.form === '%'){
        pricing.discountedPrices.total = Math.round((pricing.initialPrices.total * (100 - pricing.savingsInPercent)) / 100);
        if(enteredVoucher.renewal === '1' || enteredVoucher.renewal === 1)pricing.recurringPrices.total = Math.round((pricing.initialPrices.total * (100 - pricing.savingsInPercent)) / 100);
      }
      else {
        pricing.discountedPrices.total = parseFloat(pricing.discountedPrices.total) - parseFloat(enteredVoucher.discount)*100;
        if(pricing.discountedPrices.total<0)pricing.discountedPrices.total = 0;
        if(enteredVoucher.renewal === '1' || enteredVoucher.renewal === 1)pricing.recurringPrices.total = pricing.discountedPrices.total;
      }
    }
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