import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { lazily } from 'react-lazily'
const Dashboard = lazy(() =>import("./Dashboard"));
const { Customers } = lazily(() => import('./Customers'));
const { CustomerDetail } = lazily(() => import('./CustomerDetail'));
const { CustomerProfile } = lazily(() => import('./CustomerProfile'));
const { Subscriptions } = lazily(() => import('./Subscriptions'));
const { SubscriptionDetail } = lazily(() => import('./SubscriptionDetail'));
const { Transactions } = lazily(() => import('./Transactions'));
const { BankTransferRequests } = lazily(() => import('./BankTransferRequests'));
const { Invoices } = lazily(() => import('./Invoices'));
const { InvoicePrint } = lazily(() => import('./InvoicePrint'));
const { Coupons } = lazily(() => import('./Coupons'));
const SubscriptionManager = lazy(() =>import("./SubscriptionManager"));
const { SubscriptionManagerEdit } = lazily(() => import('./SubscriptionManagerEdit'));
const { SubscriptionCMS } = lazily(() => import('./SubscriptionCms'));
const { SubscriptionWeekCMS } = lazily(() => import('./SubscriptionWeekCMS'));
const { CouponCreate } = lazily(() => import('./CouponCreate'));
const { LinkCoupons } = lazily(() => import('./LinkCoupons'));
const { LinkCouponCreate } = lazily(() => import('./LinkCouponCreate'));
const { LinkCouponShow } = lazily(() => import('./LinkCouponShow'));
const { Categories } = lazily(() => import('./Categories'));
const { CategoryCreate } = lazily(() => import('./CategoryCreate'));
const { Events } = lazily(() => import('./Events'));
const { EventCreate } = lazily(() => import('./EventCreate'));
const { Eventos } = lazily(() => import('./Eventos'));
const { EventoCreate } = lazily(() => import('./EventoCreate'));
const { Shortcodes } = lazily(() => import('./Shortcodes'));
const { ShortcodeCreate } = lazily(() => import('./ShortcodeCreate'));
const { Keywords } = lazily(() => import('./Keywords'));
const { KeywordCreate } = lazily(() => import('./KeywordCreate'));
const { WeeklyEditor } = lazily(() => import('./WeeklyEditor'));
const { Benchmarks } = lazily(() => import('./Benchmark'));
const { BenchmarkCreate } = lazily(() => import('./BenchmarkCreate'));
const { Users } = lazily(() => import('./Users'));
const { UserCreate } = lazily(() => import('./UserCreate'));
const { Medals } = lazily(() => import('./Medals'));
const { MedalCreate } = lazily(() => import('./MedalCreate'));
const { CartSettings } = lazily(() => import('./SettingsPage/SectionCartSettings'));
const { Permissions } = lazily(() => import('./SettingsPage/SectionPermissions'));
const { Referral } = lazily(() => import('./SettingsPage/SectionReferral'));
const { TagLine } = lazily(() => import('./SettingsPage/SectionTagLine'));
const { Reports } = lazily(() => import('./SettingsPage/SectionReport'));
const { UserProfile } = lazily(() => import('./UserProfile'));
const { Survey } = lazily(() => import('./Survey'));
const { SurveyCreate } = lazily(() => import('./SurveyCreate'));
const { Products } = lazily(() => import('./Products'));
const { ViewImages } = lazily(() => import('./ViewImages'));
const { Companies } = lazily(() => import('./Companies'));
const { CompanyCreate } = lazily(() => import('./CompanyCreate'));
const { ProductCreate } = lazily(() => import('./ProductCreate'));
const { LayoutSplashScreen } = lazily(() => import('../../../_metronic'));
const { SurveyReports } = lazily(() => import('./SurveyReports'));
const { SocialReports } = lazily(() => import('./SocialReports'));

export default function AdminPage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  return (
    <Suspense fallback={<LayoutSplashScreen visible={true}/>}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/admin" to="/admin/dashboard" />
        }
        <Route exact path="/admin/dashboard" component={Dashboard} />
        <Route exact path="/admin/customers" component={Customers} />
        <Route exact path="/admin/customers/:id" component={CustomerDetail} />
        <Route exact path="/admin/customers/:id/profile" component={CustomerProfile} />
        <Route exact path="/admin/subscriptions" component={Subscriptions} />
        <Route exact path="/admin/subscriptions/:id" component={SubscriptionDetail} />
        <Route exact path="/admin/transactions" component={Transactions} />
        <Route exact path="/admin/bank-transfer-requests" component={BankTransferRequests} />
        <Route exact path="/admin/invoices" component={Invoices} />
        <Route exact path="/admin/invoices/:id" component={InvoicePrint} />
        <Route exact path="/admin/coupons" component={Coupons} />
        <Route exact path="/admin/coupons/create" component={CouponCreate} />
        <Route exact path="/admin/coupons/:id" component={CouponCreate} />
        <Route exact path="/admin/link-coupons" component={LinkCoupons} />
        <Route exact path="/admin/link-coupons/create" component={LinkCouponCreate} />
        <Route exact path="/admin/link-coupons/:id" component={LinkCouponShow} />
        <Route
          exact
          path="/admin/subscription-manager"
          component={SubscriptionManager}
        />
        <Route
          exact
          path="/admin/subscription-manager/:id"
          component={SubscriptionManagerEdit}
        />
        <Route exact path="/admin/subscription-cms/:id" component={SubscriptionCMS} />
        <Route exact path="/admin/subscription-pending/:id" component={SubscriptionWeekCMS} />
        <Route exact path="/admin/week-editor" component={WeeklyEditor} />
        <Route exact path="/admin/categories" component={Categories} />
        <Route exact path="/admin/categories/:id" component={CategoryCreate} />
        <Route exact path="/admin/events" component={Events} />
        <Route exact path="/admin/events/create" component={EventCreate} />
        <Route exact path="/admin/events/:id" component={EventCreate} />
        <Route exact path="/admin/eventos" component={Eventos} />
        <Route exact path="/admin/eventos/create" component={EventoCreate} />
        <Route exact path="/admin/eventos/:id" component={EventoCreate} />
        <Route exact path="/admin/shortcodes" component={Shortcodes} />
        <Route exact path="/admin/shortcodes/create" component={ShortcodeCreate} />
        <Route exact path="/admin/shortcodes/:id" component={ShortcodeCreate} />
        <Route exact path="/admin/keywords" component={Keywords} />
        <Route exact path="/admin/keywords/create" component={KeywordCreate} />
        <Route exact path="/admin/keywords/:id" component={KeywordCreate} />
        <Route exact path="/admin/benchmarks" component={Benchmarks} />
        <Route
          exact
          path="/admin/benchmarks/create"
          component={BenchmarkCreate}
        />
        <Route exact path="/admin/benchmarks/:id" component={BenchmarkCreate} />
        <Route exact path="/admin/users" component={Users} />
        <Route exact path="/admin/users/create" component={UserCreate} />
        <Route exact path="/admin/users/:id" component={UserCreate} />
        <Route exact path="/admin/medals" component={Medals} />
        <Route exact path="/admin/medals/create" component={MedalCreate} />
        <Route exact path="/admin/medals/:id" component={MedalCreate} />
        <Route exact path="/admin/settings/cart" component={CartSettings} />
        <Route exact path="/admin/settings/permissions" component={Permissions} />
        <Route exact path="/admin/settings/referral" component={Referral} />
        <Route exact path="/admin/settings/tag-line" component={TagLine} />
        <Route exact path="/admin/settings/reports" component={Reports} />
        <Route exact path="/admin/profile" component={UserProfile} />
        <Route exact path="/admin/survey" component={Survey} />
        <Route exact path="/admin/survey/:id" component={SurveyCreate} />
        <Route exact path="/admin/survey/create" component={SurveyCreate}/>
        <Route exact path="/admin/survey/:id/view" component={SurveyReports}/>
        <Route exact path="/admin/companies" component={Companies} />
        <Route exact path="/admin/companies/create" component={CompanyCreate} />
        <Route exact path="/admin/companies/:id" component={CompanyCreate} />
        <Route exact path="/admin/companies/:id/products" component={Products} />
        <Route exact path="/admin/companies/:id/products/create" component={ProductCreate} />
        <Route exact path="/admin/companies/:id/products/:id" component={ProductCreate} />
        <Route exact path="/admin/companies/:id/products/:id" component={ProductCreate} />
        <Route exact path="/admin/companies/:id/products/viewImages/:id" component={ViewImages} />
        <Route exact path="/admin/reports" component={SocialReports} />
      </Switch>
    </Suspense>
  );
}
