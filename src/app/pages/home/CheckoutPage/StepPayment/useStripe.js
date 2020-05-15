import { useEffect, useState } from "react";

import { loadScript } from "../../../../../lib/loadScript";

// TODO: extract to separate hooks folder.
// this hook is used in checkout and settings
export const useStripe = () => {
  // null is the default value required by StripeProvider
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (window.Stripe) {
      setStripe(window.Stripe(process.env.STRIPE_PUBLIC_KEY));
    } else if (!document.querySelector("#stripe-js")) {
      loadScript("https://js.stripe.com/v3/", "stripe-js").then(() => {
        setStripe(window.Stripe(process.env.STRIPE_PUBLIC_KEY));
      });
    }
  }, []);

  return stripe;
};
