import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Customers } from "./Customers";
import { CustomerDetail } from "./CustomerDetail";
import { CustomerProfile } from "./CustomerProfile";
import { Subscriptions } from "./Subscriptions";
import { SubscriptionDetail } from "./SubscriptionDetail";
import { Transactions } from "./Transactions";
import { BankTransferRequests } from "./BankTransferRequests";
import { Invoices } from "./Invoices";
import { InvoicePrint } from "./InvoicePrint";
import { Coupons } from "./Coupons";
import SubscriptionManager from "./SubscriptionManager";
import { SubscriptionManagerEdit } from "./SubscriptionManagerEdit";
import { SubscriptionCMS } from "./SubscriptionCms";
import { SubscriptionWeekCMS } from "./SubscriptionWeekCMS";
import { CouponCreate } from "./CouponCreate";
import { LinkCoupons } from "./LinkCoupons";
import { LinkCouponCreate } from "./LinkCouponCreate";
import { LinkCouponShow } from "./LinkCouponShow";
import { Categories} from "./Categories";
import { CategoryCreate } from "./CategoryCreate";
import { Events } from "./Events";
import { EventCreate } from "./EventCreate";
import { Eventos } from "./Eventos";
import { EventoCreate } from "./EventoCreate";
import { Shortcodes } from "./Shortcodes";
import { ShortcodeCreate } from "./ShortcodeCreate";
import { Keywords } from "./Keywords";
import { KeywordCreate } from "./KeywordCreate";
import { WeeklyEditor } from "./WeeklyEditor";
import { Benchmarks } from "./Benchmark";
import { BenchmarkCreate } from "./BenchmarkCreate";
import { Users } from "./Users";
import { UserCreate } from "./UserCreate";
import { Medals } from "./Medals";
import { MedalCreate } from "./MedalCreate";
import { CartSettings } from "./SettingsPage/SectionCartSettings";
import { Permissions } from "./SettingsPage/SectionPermissions";
import { Referral } from "./SettingsPage/SectionReferral";
import { TagLine } from "./SettingsPage/SectionTagLine";
import { Reports } from "./SettingsPage/SectionReport";
import { UserProfile } from "./UserProfile";
import {Survey}  from "./Survey";
import { SurveyCreate } from "./SurveyCreate";
import {Products}  from "./Products";
import {ViewImages}  from "./ViewImages";
import {Companies}  from "./Companies";
import { CompanyCreate } from "./CompanyCreate";
import { ProductCreate } from "./ProductCreate";
import { LayoutSplashScreen } from "../../../_metronic";
import { SurveyReports } from "./SurveyReports";
import { SocialReports } from "./SocialReports";

export default function AdminPage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
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
