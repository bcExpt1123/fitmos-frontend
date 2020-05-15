import React from "react";
import SectionRenew from "./SectionRenew";
import SectionWorkout from "./SectionWorkout";
import SectionProfile from "./SectionProfile";
import SectionCondition from "./SectionCondition";
import SectionSubscription from "./SectionSubscription";
import SectionBenchmark from "./SectionBenchmark";
import SectionNews from "./SectionNews";
import SectionEmail from "./SectionEmail";

const SettingsPage = ({ currentUser }) => {
  return (
    <div className="c-dashboard dashborad-backgorund">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            {currentUser.has_active_workout_subscription ? (
              <>
                {currentUser.customer.email_update==0&&(
                  <SectionEmail />
                )}
                <SectionWorkout />
              </>
            ) : (
              currentUser.has_workout_subscription&&(
                <SectionRenew />
              )
            )}
          </div>
          <div className="col-12 col-md-6">
            <SectionProfile />
            <SectionCondition />
            <SectionSubscription />
            <SectionBenchmark />
            <SectionNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = state => ({
  // TODO: should be converted in api call, we're using kebab-case for bundles everywhere,
  // should be refactored later
  // TODO: should be converted in api call
  currentUser: state.auth.currentUser
});

export const mapDispatchToProps = {};

export default SettingsPage;
