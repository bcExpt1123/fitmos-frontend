import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import Signup from "./Signup";
import PasswordResetPage from "../../pages/auth/PasswordResetPage";
import Login from "../../pages/auth/LogInPage";
import Pricing from "./Pricing";
import Checkout from "./Checkout";
import Ayuda from "./Ayuda";
import Contact from "./Contact";
// import Posts from "./Posts";
import Posts from "./ExplorePage/Blog";
import Post from "./ExplorePage/Post";
import Profile from "./SettingsPage/SectionEditProfile";
import Payments from "./SettingsPage/SectionPayments";
import Invoices from "./SettingsPage/SectionInvoices";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import CookiesPolicy from "./Pages/Cookies";
import Subscriptions from "./SettingsPage/SectionSubscriptions";
import Shop from "./ExplorePage/Shop";
import Company from "./ExplorePage/Company";
import Product from "./ExplorePage/Product";
// import Shop from "./Shop";
// import Shop from "./ExplorePage/Shop";
// import Company from "./Company";
// import Product from "./Product";
import Partners from "./Partners";
// import Benchmarks from "./Benchmarks";
import Benchmarks from "./ExplorePage/Benchmark";
import ProfilePage from "./Profile";
import ProfilePicturesPage from "./social/posts/Pictures";
import PerfilPage from "./Perfil";
import Workout from "./Workout";
import LevelPage from "./Level";
import SubscriptionTabs from "./Subscriptions";
import NewsfeedPage from "./Newsfeed";
import LeaderboardPage from "./Leaderboard";
// import Customer from "./Customer";
import SearchPage from "./Search";
import SearchCustomersPage from "./SearchCustomers";
import SearchCompaniesPage from "./SearchCompanies";
import SearchPostsPage from "./SearchPosts";
import SocialPostPage from "./social/posts/Post";
import Events from "./ExplorePage/Events";
import Event from "./ExplorePage/Event";
import UsernamePage from "./Username";
import { LayoutSplashScreen } from "../../../_metronic";

export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/workout" component={Workout} />
        <Route exact path="/about" component={About} />
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
        <Route exact path="/shop" component={Shop} />
        {/* <Route exact path="/shop/companies/:id" component={Company} /> */}
        <Route exact path="/shop/products/:id" component={Product} />
        {/* <Route exact path="/customers/:id" component={Customer} /> */}
        <Route exact path="/partners" component={Partners} />
        <Route exact path="/benchmarks" component={Benchmarks} />
        <Route exact path="/profile" component={ProfilePage} />
        {/* <Route exact path="/profile/pictures" component={ProfilePicturesPage} /> */}
        <Route exact path="/perfil" component={PerfilPage} />
        <Route exact path="/level" component={LevelPage} />
        <Route exact path="/subscriptions" component={SubscriptionTabs} />
        <Route exact path="/newsfeed" component={NewsfeedPage} />
        <Route exact path="/leaderboard" component={LeaderboardPage} />
        <Route exact path="/search" component={SearchPage} />
        <Route exact path="/search-people" component={SearchCustomersPage} />
        <Route exact path="/search-shops" component={SearchCompaniesPage} />
        <Route exact path="/search-posts" component={SearchPostsPage} />
        <Route exact path="/posts/:id" component={SocialPostPage} />
        <Route exact path="/eventos" component={Events} />
        <Route exact path="/eventos/:id" component={Event} />
        <Route exact path="/:username" component={UsernamePage} />
        <Route exact path="/:username/pictures" component={ProfilePicturesPage} />        
      </Switch>
    </Suspense>
  );
}
