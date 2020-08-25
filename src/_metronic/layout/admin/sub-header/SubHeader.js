/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "react-redux";
import objectPath from "object-path";
import { withRouter } from "react-router-dom";
import * as builder from "../../../ducks/builder";
import { Redirect, Route, Switch } from "react-router-dom";
import { SubHeaderDashboard } from "../../../../app/pages/admin/Dashboard";
import { SubHeaderCustomers } from "../../../../app/pages/admin/Customers";
import { SubHeaderCustomerDetail } from "../../../../app/pages/admin/CustomerDetail";
import { SubHeaderSubscriptions } from "../../../../app/pages/admin/Subscriptions";
import { SubHeaderSubscriptionDetail } from "../../../../app/pages/admin/SubscriptionDetail";
import { SubHeaderTransactions } from "../../../../app/pages/admin/Transactions";
import { SubHeaderInvoices } from "../../../../app/pages/admin/Invoices";
import { SubHeaderInvoicePrint } from "../../../../app/pages/admin/InvoicePrint";
import { SubHeaderCoupons } from "../../../../app/pages/admin/Coupons";
import { SubHeaderCouponCreate } from "../../../../app/pages/admin/CouponCreate";
import { SubHeaderSubscriptionManager } from "../../../../app/pages/admin/SubscriptionManager";
import { SubHeaderSubscriptionManagerEdit } from "../../../../app/pages/admin/SubscriptionManagerEdit";
import { SubHeaderSubscriptionCMS } from "../../../../app/pages/admin/SubscriptionCms";
import { SubHeaderSubscriptionWeekCMS } from "../../../../app/pages/admin/SubscriptionWeekCMS";
import { SubHeaderCategories} from "../../../../app/pages/admin/Categories";
import { SubHeaderCategoryCreate} from "../../../../app/pages/admin/CategoryCreate";
import { SubHeaderEvents } from "../../../../app/pages/admin/Events";
import { SubHeaderEventCreate } from "../../../../app/pages/admin/EventCreate";
import { SubHeaderShortcodes } from "../../../../app/pages/admin/Shortcodes";
import { SubHeaderShortcodeCreate } from "../../../../app/pages/admin/ShortcodeCreate";
import { SubHeaderWeeklyEditor } from "../../../../app/pages/admin/WeeklyEditor";
import { SubHeaderBenchmarks } from "../../../../app/pages/admin/Benchmark";
import { SubHeaderBenchmarkCreate } from "../../../../app/pages/admin/BenchmarkCreate";
import { SubHeaderUserProfile } from "../../../../app/pages/admin/UserProfile";
import { SubHeaderUsers } from "../../../../app/pages/admin/Users";
import { SubHeaderMedals } from "../../../../app/pages/admin/Medals";
import { SubHeaderMedalCreate } from "../../../../app/pages/admin/MedalCreate";
import { SubHeaderUserCreate } from "../../../../app/pages/admin/UserCreate";
import { SubHeaderPermissions } from "../../../../app/pages/admin/SettingsPage/SectionPermissions";
import { SubHeaderCartSettings } from "../../../../app/pages/admin/SettingsPage/SectionCartSettings";
import { SubHeaderReferralSettings } from "../../../../app/pages/admin/SettingsPage/SectionReferral";
import { SubHeaderTagLineSettings } from "../../../../app/pages/admin/SettingsPage/SectionTagLine";
import { SubHeaderSurvey } from "../../../../app/pages/admin/Survey";
import { SubHeaderSurveyCreate } from "../../../../app/pages/admin/SurveyCreate";
import { SubHeaderCompanies } from "../../../../app/pages/admin/Companies";
import { SubHeaderCompanyCreate } from "../../../../app/pages/admin/CompanyCreate";
import { SubHeaderProducts } from "../../../../app/pages/admin/Products";
import { SubHeaderProductCreate } from "../../../../app/pages/admin/ProductCreate";
import { SubHeaderViewImages } from "../../../../app/pages/admin/ViewImages";
import { SubHeaderSurveyReports } from "../../../../app/pages/admin/SurveyReports";

// import BreadCrumbs from "./components/BreadCrumbs";

class SubHeader extends React.Component {
  render() {
    const {
      subheaderCssClasses,
      subheaderContainerCssClasses,
    } = this.props;
    return (
      <div
        id="kt_subheader"
        className={`kt-subheader ${subheaderCssClasses} kt-grid__item`}
      >
        <div className={`kt-container ${subheaderContainerCssClasses}`}>
          <Switch>
            {
              /* Redirect from root URL to /dashboard. */
              <Redirect exact from="/admin" to="/admin/dashboard" />
            }
            <Route
              exact
              path="/admin/dashboard"
              component={SubHeaderDashboard}
            />
            <Route
              exact
              path="/admin/customers"
              component={SubHeaderCustomers}
            />
            <Route
              exact
              path="/admin/customers/:id"
              component={SubHeaderCustomerDetail}
            />
            <Route
              exact
              path="/admin/subscriptions"
              component={SubHeaderSubscriptions}
            />
            <Route
              exact
              path="/admin/subscriptions/:id"
              component={SubHeaderSubscriptionDetail}
            />
            <Route
              exact
              path="/admin/transactions"
              component={SubHeaderTransactions}
            />
            <Route exact path="/admin/invoices" component={SubHeaderInvoices} />
            <Route exact path="/admin/invoices/:id" component={SubHeaderInvoicePrint} />
            <Route exact path="/admin/coupons" component={SubHeaderCoupons} />
            <Route
              exact
              path="/admin/coupons/create"
              component={SubHeaderCouponCreate}
            />
            <Route
              exact
              path="/admin/coupons/:id"
              component={SubHeaderCouponCreate}
            />
            <Route
              exact
              path="/admin/subscription-manager"
              component={SubHeaderSubscriptionManager}
            />
            <Route
              exact
              path="/admin/subscription-manager/:id"
              component={SubHeaderSubscriptionManagerEdit}
            />
            <Route
              exact
              path="/admin/subscription-cms/:id"
              component={SubHeaderSubscriptionCMS}
            />
            <Route
              exact
              path="/admin/subscription-pending/:id"
              component={SubHeaderSubscriptionWeekCMS}
            />
            <Route
              exact
              path="/admin/week-editor"
              component={SubHeaderWeeklyEditor}
            />
            <Route exact path="/admin/categories" component={SubHeaderCategories} />
            <Route exact path="/admin/categories/create" component={SubHeaderCategoryCreate} />
            <Route exact path="/admin/categories/:id" component={SubHeaderCategoryCreate} />
            <Route exact path="/admin/events" component={SubHeaderEvents} />
            <Route
              exact
              path="/admin/events/create"
              component={SubHeaderEventCreate}
            />
            <Route
              exact
              path="/admin/events/:id"
              component={SubHeaderEventCreate}
            />
            <Route
              exact
              path="/admin/shortcodes"
              component={SubHeaderShortcodes}
            />
            <Route
              exact
              path="/admin/shortcodes/create"
              component={SubHeaderShortcodeCreate}
            />
            <Route
              exact
              path="/admin/shortcodes/:id"
              component={SubHeaderShortcodeCreate}
            />
            <Route
              exact
              path="/admin/benchmarks"
              component={SubHeaderBenchmarks}
            />
            <Route
              exact
              path="/admin/benchmarks/create"
              component={SubHeaderBenchmarkCreate}
            />
            <Route
              exact
              path="/admin/benchmarks/:id"
              component={SubHeaderBenchmarkCreate}
            />
            <Route exact path="/admin/medals" component={SubHeaderMedals} />
            <Route exact path="/admin/medals/create" component={SubHeaderMedalCreate} />
            <Route exact path="/admin/medals/:id" component={SubHeaderMedalCreate} />
            <Route
              exact
              path="/admin/users"
              component={SubHeaderUsers}
            />
            <Route
              exact
              path="/admin/users/create"
              component={SubHeaderUserCreate}
            />
            <Route
              exact
              path="/admin/users/:id"
              component={SubHeaderUserCreate}
            />
            <Route
              exact
              path="/admin/settings/permissions"
              component={SubHeaderPermissions}
            />
            <Route
              exact
              path="/admin/settings/cart"
              component={SubHeaderCartSettings}
            />
            <Route
              exact
              path="/admin/settings/referral"
              component={SubHeaderReferralSettings}
            />
            <Route
              exact
              path="/admin/settings/tag-line"
              component={SubHeaderTagLineSettings}
            />
            <Route
              exact
              path="/admin/profile"
              component={SubHeaderUserProfile}
            />
            <Route
              exact
              path="/admin/survey"
              component={SubHeaderSurvey}
            />
            <Route
              exact
              path="/admin/survey/create"
              component={SubHeaderSurveyCreate}
            />
            <Route
              exact
              path="/admin/survey/:id"
              component={SubHeaderSurveyCreate}
            />
            <Route
              exact
              path="/admin/survey/:id/view"
              component={SubHeaderSurveyReports}
            />
            <Route
              exact
              path="/admin/companies"
              component={SubHeaderCompanies}
            />
            <Route
              exact
              path="/admin/companies/create"
              component={SubHeaderCompanyCreate}
            />
            <Route
              exact
              path="/admin/companies/:id"
              component={SubHeaderCompanyCreate}
            />
            <Route
              exact
              path="/admin/companies/:id/products"
              component={SubHeaderProducts}
            />
            <Route
              exact
              path="/admin/companies/:id/products/create"
              component={SubHeaderProductCreate}
            />
            <Route
              exact
              path="/admin/companies/:id/products/:id"
              component={SubHeaderProductCreate}
            />
            <Route
              exact
              path="/admin/companies/:id/products/viewImages/:id"
              component={SubHeaderViewImages}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  config: store.builder.layoutConfig,
  menuConfig: store.builder.menuConfig,
  subheaderMobileToggle: objectPath.get(
    store.builder.layoutConfig,
    "subheader.mobile-toggle"
  ),
  subheaderCssClasses: builder.selectors.getClasses(store, {
    path: "subheader",
    toString: true
  }),
  subheaderContainerCssClasses: builder.selectors.getClasses(store, {
    path: "subheader_container",
    toString: true
  })
});

export default withRouter(connect(mapStateToProps)(SubHeader));
