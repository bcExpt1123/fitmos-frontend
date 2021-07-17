import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
const PasswordResetPage = lazy(() =>
  import("../../pages/auth/PasswordResetPage")
);
const Login = lazy(() =>
  import("../../pages/auth/LogInPage")
);
const About = lazy(() =>
  import("./About")
);
const Home = lazy(() =>
  import("./Home")
);
const Signup = lazy(() =>
  import("./Signup")
);
const Pricing = lazy(() =>
  import("./Pricing")
);
const Checkout = lazy(() =>
  import("./Checkout")
);
const Ayuda = lazy(() =>
  import("./Ayuda")
);
const Contact = lazy(() =>
  import("./Contact")
);
// import Posts from "./Posts";
const Posts = lazy(() =>
  import("./ExplorePage/Blog")
);
const Post = lazy(() =>
  import("./ExplorePage/Post")
);
const Profile = lazy(() =>
  import("./SettingsPage/SectionEditProfile")
);
const Payments = lazy(() =>
  import("./SettingsPage/SectionPayments")
);
const Invoices = lazy(() =>
  import("./SettingsPage/SectionInvoices")
);
const Terms = lazy(() =>
  import("./Pages/Terms")
);
const Privacy = lazy(() =>
  import("./Pages/Privacy")
);
const CookiesPolicy = lazy(() =>
  import("./Pages/Cookies")
);
const Subscriptions = lazy(() =>
  import("./SettingsPage/SectionSubscriptions")
);
const Shop = lazy(() =>
  import("./ExplorePage/Shop")
);
// import Company from "./ExplorePage/Company";
const Product = lazy(() =>
  import("./ExplorePage/Product")
);
const Partners = lazy(() =>
  import("./Partners")
);
const Benchmarks = lazy(() =>
  import("./ExplorePage/Benchmark")
);
const ProfilePage = lazy(() =>
  import("./Profile")
);
const ProfilePicturesPage = lazy(() =>
  import("./social/posts/Pictures")
);
const Workout = lazy(() =>
  import("./Workout")
);
const LevelPage = lazy(() =>
  import("./Level")
);
const SubscriptionTabs = lazy(() =>
  import("./Subscriptions")
);
const NewsfeedPage = lazy(() =>
  import("./Newsfeed")
);
const LeaderboardPage = lazy(() =>
  import("./Leaderboard")
);
const SearchPage = lazy(() =>
  import("./Search")
);
const SearchCustomersPage = lazy(() =>
  import("./SearchCustomers")
);
const SearchCompaniesPage = lazy(() =>
  import("./SearchCompanies")
);
const SearchPostsPage = lazy(() =>
  import("./SearchPosts")
);
const SocialPostPage = lazy(() =>
  import("./social/posts/Post")
);
const Events = lazy(() =>
  import("./ExplorePage/Events")
);
const Event = lazy(() =>
  import("./ExplorePage/Event")
);
const UsernamePage = lazy(() =>
  import("./Username")
);
const Member = lazy(() =>
  import("./ExplorePage/Member")
); 
const ProfileWorkoutsPage = lazy(() =>
import("./ProfileWorkouts")
); 
export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  return (
    <Suspense fallback={<LayoutSplashScreen visible={true}/>}>
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
        <Route exact path="/miembros" component={Member} />
        <Route exact path="/:username" component={UsernamePage} />
        <Route exact path="/:username/pictures" component={ProfilePicturesPage} />        
        <Route exact path="/:username/workouts" component={ProfileWorkoutsPage} />
      </Switch>
    </Suspense>
  );
}
