import React, { useEffect, useMemo, useState } from "react";
import { useCurrentRoute, useNavigation } from "react-navi";
import PropTypes from "prop-types";
import { connect,useDispatch } from "react-redux";
import { injectIntl } from "react-intl";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import StepPayment from "./CheckoutPage/StepPayment";
import { initialVoucher,checkVoucher,generateFirstPayVoucher } from "./redux/vouchers/actions";
import { checkPaymentMode, changeVoucher,inside,outside } from "./redux/checkout/actions";
import {reactLocalStorage} from 'reactjs-localstorage';

const styles = {};

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  countryCode: state.countryCode,
  serviceItem: state.service.item,
  frequency: state.service.frequency,
  activePlan: state.service.activePlan,
  coupons: state.vouchers
});
const mapDispatchToProps = {
  initialVoucher,
  checkPaymentMode,
  checkVoucher,
  changeVoucher,
  generateFirstPayVoucher
};

const CheckoutPage = ({
  currentUser,
  countryCode,
  serviceItem,
  frequency,
  activePlan,
  coupons,
  initialVoucher,
  checkPaymentMode,
  changeVoucher,
  checkVoucher,
  generateFirstPayVoucher,
  history
}) => {
  // referrer or campaign.
  const [enteredVoucher, setEnteredVoucher] = useState(() => {
    const values = Object.values(coupons);
    if (values[0] && values[0].discount) return values[0];
    return false;
  });
  const [removeCoupon,setRemoveCoupon] = useState(false);
  useEffect(() => {
    const values = Object.values(coupons);
    if (values[0] && values[0].discount) {
      setEnteredVoucher(values[0]);
    }else{
      if(!currentUser.has_workout_subscription){
        //if(!removeCoupon)generateFirstPayVoucher();
      }  
    }
  },[coupons]);
  const dispatch = useDispatch();
  useEffect(() => {
    reactLocalStorage.set('checkout', true);
    dispatch(inside({activePlan}));
    checkVoucher();
    dispatch(checkPaymentMode());
    return () => {
      dispatch(outside());
    };
  },[]);
  

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

  let pricing = {
    initialPrices: { total: serviceItem[activePlan] * 100 },
    originalPrices: undefined,
    discountedPrices: { total: serviceItem[activePlan] * 100 },
    recurringPrices: { total: serviceItem[activePlan] * 100 },
    refundAmountCents: undefined,
    currentSubscriptionsAmountCents: undefined,
    bundlePrices: { total: serviceItem[activePlan] * 100 }
  };
  if (enteredVoucher && (!currentUser.has_workout_subscription || currentUser.has_workout_subscription && enteredVoucher.renewal == '1')) {
    pricing.appliedVoucher = enteredVoucher;
    pricing.savingsInPercent = enteredVoucher.discount;
    if(enteredVoucher.form == '%')pricing.discountedPrices.total = Math.round((pricing.initialPrices.total * (100 - pricing.savingsInPercent)) / 100);
    else {
      pricing.discountedPrices.total = parseFloat(pricing.discountedPrices.total) - parseFloat(enteredVoucher.discount)*100;
      if(pricing.discountedPrices.total<0)pricing.discountedPrices.total = 0;
    }
  }
  // in case of user is navigating to some other page PE-14498 fix
  // this part of the fix prevents rendering of checkout 1st step
  // during transition to the new URL
  if (currentUrl.split("/")[1] !== "checkout") return null;

  const onEnteredVoucherChange = newEnteredVoucher => {
    setEnteredVoucher(newEnteredVoucher);
    changeVoucher();
  };

  const resetActiveVoucher = () => {
    initialVoucher();
    setEnteredVoucher(undefined);
    setRemoveCoupon(true);
    changeVoucher();
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
          countryCode={countryCode}
          pricing={pricing}
          enteredVoucher={enteredVoucher}
          selectedProduct={selectedProduct}
          vouchers={vouchers}
          onEnteredVoucherChange={onEnteredVoucherChange}
          resetActiveVoucher={resetActiveVoucher}
        />
        <Footer  checkout={true} />
      </article>
    </>
  );
};

CheckoutPage.defaultProps = {
  currentUser: { gender: "Male" }
};

CheckoutPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  currentUser: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(CheckoutPage)));
