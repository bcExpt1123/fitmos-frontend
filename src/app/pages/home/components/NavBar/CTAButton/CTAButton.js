import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import parseDate from "date-fns/parse";
import differenceInDays from "date-fns/differenceInCalendarDays";

import CampaignButton from "../../CampaignButton";

const SubscriptionState = {
  NONE: "NONE", // no training subscription
  ACTIVE: "ACTIVE", // active training subscription, recurring payments
  INACTIVE: "INACTIVE", // inactive training subscription
  AGREE: "AGREE", // active training subscription, no recurring payments, subscription ends in more than 14 days
  AGREE_ENDING_SOON: "AGREE_ENDING_SOON" // active training subscription, no recurring payments, subscription ends in less than 14 days
};

const subscriptionState = (claims = {}) => {
  const hasClaim = Boolean(claims.training);
  const hasActiveClaim = claims.training && claims.training.status === "active";
  const hasActiveSubscription =
    claims.training && claims.training.subscription.status === "active";
  const isSubscriptionEndingSoon =
    claims.training &&
    differenceInDays(parseDate(claims.training.end_date), new Date()) < 14;

  if (hasClaim) {
    if (hasActiveClaim) {
      if (hasActiveSubscription) {
        return SubscriptionState.ACTIVE;
      }

      if (isSubscriptionEndingSoon) {
        return SubscriptionState.AGREE_ENDING_SOON;
      }

      return SubscriptionState.AGREE;
    }

    return SubscriptionState.INACTIVE;
  }

  return SubscriptionState.NONE;
};

const mapStateToProps = state => ({
  claims: state.claims,
  currentUser: state.auth.currentUser
});

const CTAButton = ({ analyticsCid, claims, className, currentUser }) => {
  const isLoggedIn = Boolean(currentUser);

  let label;

  if (isLoggedIn) {
    switch (subscriptionState(claims)) {
      case SubscriptionState.NONE:
        label = "NavBar.Button.Cta.GetCoach";
        break;
      case SubscriptionState.INACTIVE:
        label = "NavBar.Button.Cta.ContinueCoach";
        break;
      case SubscriptionState.AGREE_ENDING_SOON:
        label = "NavBar.Button.Cta.RenewCoach";
        break;
      case SubscriptionState.ACTIVE:
      case SubscriptionState.AGREE:
      default:
        // no label in this case - do not display button
        break;
    }
  } else {
    label = "NavBar.Button.Cta.Start";
  }
  const href = false;

  return label && href ? (
    <CampaignButton
      service="training"
      size="xs"
      className={className}
      href={href}
      data-analytics-cid={analyticsCid}
      data-analytics-ga-interaction-code="GE-NAVI"
      data-analytics-ga-subcategory="main-nav"
      data-analytics-ga-attribute="start your workout now"
    >
      <FormattedMessage id={label} />
    </CampaignButton>
  ) : null;
};

CTAButton.defaultProps = {
  currentUser: null,
  className: null,
  analyticsCid: null,
  claims: {}
};

CTAButton.propTypes = {
  // properties passed by user
  analyticsCid: PropTypes.string,
  className: PropTypes.string,

  // properties passed by connect
  /* eslint-disable react/forbid-prop-types */
  claims: PropTypes.object,
  currentUser: PropTypes.object
  /* eslint-enable react/forbid-prop-types */
};

export { mapStateToProps };
export default CTAButton;
