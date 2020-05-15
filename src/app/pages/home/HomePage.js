import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import Slick from "./slick";
import Signup from "./Signup";
import PasswordResetPage from "../../pages/auth/PasswordResetPage";
import Login from "../../pages/auth/LogInPage";
import Pricing from "./Pricing";
import Checkout from "./Checkout";
import Ayuda from "./Ayuda";
import Contact from "./Contact";
import Posts from "./Posts";
import Post from "./Post";
import Profile from "./SettingsPage/SectionEditProfile";
import Payments from "./SettingsPage/SectionPayments";
import Invoices from "./SettingsPage/SectionInvoices";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import CookiesPolicy from "./Pages/Cookies";
import Subscriptions from "./SettingsPage/SectionSubscriptions";
import { LayoutSplashScreen } from "../../../_metronic";
import * as Cookies from "./services/storage";

export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/slick" component={Slick} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/pricing" component={Pricing} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/ayuda" component={Ayuda} />
        <Route exact path="/news" component={Posts} />
        <Route exact path="/news/:id" component={Post} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/auth/login" component={Login} />
        <Route
          exact
          path="/auth/forgot-password"
          component={PasswordResetPage}
        />
        <Route exact path="/settings/profile" component={Profile} />
        <Route exact path="/settings/payments" component={Payments} />
        <Route exact path="/settings/bills" component={Invoices} />
        <Route exact path="/settings/subscriptions" component={Subscriptions} />
        <Route exact path="/terms_and_condition" component={Terms} />
        <Route exact path="/privacy" component={Privacy} />
        <Route exact path="/cookies" component={CookiesPolicy} />
      </Switch>
    </Suspense>
  );
}
