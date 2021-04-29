/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import {reactLocalStorage} from 'reactjs-localstorage';
import * as qs from 'query-string';

import HomePage from "../pages/home/HomePage";
import AdminPage from "../pages/admin/AdminPage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import Layout from "../../_metronic/layout/admin/Layout";
import FrontBannerLayout from "../../_metronic/layout/front/BannerLayout";
import * as routerHelpers from "../router/RouterHelpers";
import {validCartId} from "../pages/home/redux/checkout/actions";
import { setReferralVoucher } from "../pages/home/redux/vouchers/actions";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
    const environment = process.env.NODE_ENV;
    if(environment!=='development'){
      // this.props.history.push('/');
      // reactLocalStorage.clear();
      // window.location.reload(true);
    }
  }
  
  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}
export const Routes = withRouter(({ history }) => {
  const lastLocation = useLastLocation();
  routerHelpers.saveLastLocation(lastLocation);
  if (window.location.host === 'fitemos.com'){
    window.location = window.location.protocol + "//www." + window.location.host + window.location.pathname;
  }
  if(window.location.pathname==='/' && window.location.hash==='#privacy')history.push('/privacy');
  if(window.location.pathname==='/' && window.location.hash==='#terms_and_condition')history.push('/terms_and_condition');
  const {
    isAuthorized,
    isAdmin,
    hasWorkoutSubscription,
    menuConfig,
    userLastLocation,
    currentUser,
    checkoutDone,
    paymentType
  } = useSelector(
    ({ auth, checkout,service, builder: { menuConfig } }) => ({
      menuConfig,
      isAuthorized: auth.currentUser != null,
      isAdmin:
        auth.currentUser && auth.currentUser.type === "admin" ? true : false,
      hasWorkoutSubscription: auth.currentUser
        ? auth.currentUser.has_active_workout_subscription
        : false,
      userLastLocation: routerHelpers.getLastLocation(),
      currentUser:auth.currentUser,
      checkoutDone:checkout.status,
      paymentType:service.type
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  if(window.location.pathname==='/' && window.location.hash.substr(0,9)==='#checkout'){
    const parsed = qs.parse(window.location.hash);
    if (parsed['checkout?cart']) {
      const id = parsed['checkout?cart'];
      if(currentUser){
        if(isAdmin===false){
          dispatch(validCartId({id,history}));
        }
      }else{
        reactLocalStorage.set('cartId',id);
      }
    }  
  }else{
    if( currentUser && window.location.pathname==='/signup'){
      const parsedSearch = qs.parse(window.location.search);
      if(parsedSearch.referral)dispatch(setReferralVoucher(parsedSearch.referral));
    }else{
      const id = reactLocalStorage.get('cartId');
      if( id && currentUser && isAdmin===false){
        dispatch(validCartId({id,history}));
      }
    }
  }
  if(window.location.pathname==='/' && window.location.hash==='#unsubscribe'){
    if(currentUser&&currentUser.customer){
      history.push('/settings/notifications');
    }else{
      reactLocalStorage.set('redirect','/settings/notifications');
    }
  }
  const redirect = reactLocalStorage.get('redirect');
  if(currentUser){
    reactLocalStorage.remove('redirect');
  }
  const urls = [
    "/admin",
    "/admin/dashboard",
    "/admin/customers",
    "/admin/customers/:id",
    "/admin/customers/:id/profile",
    "/admin/subscriptions",
    "/admin/subscriptions/:id",
    "/admin/transactions",
    "/admin/bank-transfer-requests",
    "/admin/invoices",
    "/admin/invoices/:id",
    "/admin/coupons",
    "/admin/coupons/create",
    "/admin/coupons/:id",
    "/admin/link-coupons",
    "/admin/link-coupons/create",
    "/admin/link-coupons/:id",
    "/admin/subscription-manager",
    "/admin/subscription-manager/:id",
    "/admin/subscription-cms/:id",
    "/admin/subscription-pending/:id",
    "/admin/week-editor",
    "/admin/events",
    "/admin/events/create",
    "/admin/events/:id",
    "/admin/categories",
    "/admin/categories/:id",
    "/admin/shortcodes",
    "/admin/shortcodes/create",
    "/admin/shortcodes/:id",
    "/admin/keywords",
    "/admin/keywords/create",
    "/admin/keywords/:id",
    "/admin/benchmarks",
    "/admin/benchmarks/create",
    "/admin/benchmarks/:id",
    "/admin/users",
    "/admin/users/create",
    "/admin/users/:id",
    "/admin/medals",
    "/admin/medals/create",
    "/admin/medals/:id",
    "/admin/settings/cart",
    "/admin/settings/permissions",
    "/admin/settings/referral",
    "/admin/settings/tag-line",
    "/admin/settings/reports",
    "/admin/profile",
    "/admin/survey",
    "/admin/survey/create",
    "/admin/survey/:id",
    "/admin/survey/:id/view",
    "/admin/companies",
    "/admin/companies/create",
    "/admin/companies/:id",
    "/admin/companies/:id/products",
    "/admin/companies/:id/products/create",
    "/admin/companies/:id/products/:id",
    "/admin/companies/:id/products/viewImages/:id",
    "/admin/eventos",
    "/admin/eventos/create",
    "/admin/eventos/:id",
    "/admin/reports",
  ];
  const frontBannerUrls = [
    "/",
    "/workout",  
    "/home",
    "/shop",//new
    "/shop/companies/:id",//new
    "/shop/products/:id",//new
    "/benchmarks",//new
    "/partners",//new
    "/profile",
    "/profile/pictures",//new
    "/perfil",//new
    "/level",//new
    "/subscriptions",//new
    // "/customers/:id",//new
    // "/customers/:id/pictures",//new
    "/search",
    "/search-people",
    "/search-shops",
    "/search-posts",
    "/pricing",
    "/checkout",
    "/settings/subscriptions",
    "/settings/profile",
    "/settings/payments",
    "/settings/bills",
    "/settings/notifications",
    "/news",
    "/news/:id",
    "/posts",
    "/posts/:id",
    "/ayuda",
    "/contact",
    "/terms_and_condition",
    "/privacy",
    "/cookies",
    "/newsfeed",
    "/leaderboard",
    "/eventos",
    "/eventos/:id",
    "/:username",
    "/:username/pictures",
  ];
  const frontUnauthorizedUrls = [
    "/",
    "/ayuda",
    "/contact",
    "/terms_and_condition",
    "/privacy",
    "/cookies",
    "/pricing",
    "/news",
    "/news/:id",
    "/signup",
    "/auth/login",
    "/auth/forgot-password",
    "/:username",
  ];
  return (
    /* Create `LayoutContext` from current `history` and `menuConfig`. */
    <LayoutContextProvider history={history} menuConfig={menuConfig}>
      <ErrorBoundary history={history}>
      <Switch>
        <Route path="/error" component={ErrorsPage} />
        {!isAuthorized ? (
          /* Render auth page when user at `/auth` and not authorized. */
          <Route exact path={frontUnauthorizedUrls}>
            <FrontBannerLayout>
              <HomePage userLastLocation={userLastLocation} />
            </FrontBannerLayout>
          </Route>
        ) : /* Otherwise redirect to root page (`/`) */
        isAdmin ? (
          <Route exact path={urls}>
            <Layout>
              <AdminPage userLastLocation={userLastLocation} />
            </Layout>
          </Route>
        ) : (
          <Route exact path={frontBannerUrls}>
            <FrontBannerLayout>
              <HomePage userLastLocation={userLastLocation} />
            </FrontBannerLayout>
          </Route>
        )}
        <Route path="/logout" component={LogoutPage} />
        {isAuthorized ? (
          isAdmin ? (
            /* Redirect to `/auth` when user is not authorized */
            <Redirect from="/" to="/admin" />
          ) : hasWorkoutSubscription ? (
            <>
              {redirect?<Redirect from="/auth" to={`/${redirect}`} />
                :
                <Redirect from="/auth" to="/" />
              }
            </>
          ) : (
            checkoutDone === "done" && paymentType === "bank"?
            <>
              <Redirect from="/" to="/checkout" />
            </>
            :
            <>
              <Redirect from="/" to="/pricing" />
            </>
          )
        ) : (
          <Redirect to="/auth/login" />
        )}
      </Switch>
      </ErrorBoundary>
    </LayoutContextProvider>
  );
});
