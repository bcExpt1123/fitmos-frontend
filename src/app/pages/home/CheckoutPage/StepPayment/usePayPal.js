import { useEffect, useState } from "react";

export const usePayPal = () => {
  const [payPal, setPayPal] = useState();

  useEffect(() => {
    if (window.paypal) {
      setPayPal(window.paypal);
    } else {
      /*window.paypalCheckoutReady = () => {
        let clientId;
        const { REACT_APP_PAYMENT_TEST,REACT_APP_PAYPAL_SANDBOX_CLIENT_ID,REACT_APP_PAYPAL_CLIENT_ID,REACT_APP_PAYPAL_MERCHANT_ID } = process.env;
        if(REACT_APP_PAYMENT_TEST) clientId =REACT_APP_PAYPAL_SANDBOX_CLIENT_ID;
        else clientId =REACT_APP_PAYPAL_CLIENT_ID;
        window.paypal.checkout.setup(REACT_APP_PAYPAL_MERCHANT_ID, {
          environment:
            REACT_APP_PAYMENT_TEST===false ? 'production' : 'sandbox',
          container: [],
          buttons: [],
        });
        setPayPal(window.paypal);
      };*/
      let clientId;
      const {
        REACT_APP_PAYMENT_TEST,
        REACT_APP_PAYPAL_SANDBOX_CLIENT_ID,
        REACT_APP_PAYPAL_CLIENT_ID
      } = process.env;
      if (REACT_APP_PAYMENT_TEST) clientId = REACT_APP_PAYPAL_SANDBOX_CLIENT_ID;
      else clientId = REACT_APP_PAYPAL_CLIENT_ID;
      const script = document.createElement("script");
      //script.src = 'https:////www.paypalobjects.com/api/checkout.js';
      script.src = "https://www.paypal.com/sdk/js?client-id=" + clientId;
      script.async = true;
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }, []);

  return payPal;
};
