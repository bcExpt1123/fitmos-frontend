import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Button from "../Button";
import { fetchCampaign } from "../../redux/campaign/actions";

//import { CAMPAIGN_TARGETS } from '../../constants/campaign-targets';
//import { BRANDS } from '../../constants/brands';
import { checkoutUrl } from "../../../../../lib/checkoutUrl";
const BRANDS = {};
const CAMPAIGN_TARGETS = {};
const states = {};

const mapStateToProps = state => ({
  campaign: state.campaign.campaign,
  currentUser: state.auth.currentUser
});
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ fetchCampaign }, dispatch)
});

const CampaignButton = ({
  actions,
  service,
  campaign,
  children,
  currentUser,
  href,
  ...props
}) => {
  useEffect(() => {
    if (!campaign) {
      actions.fetchCampaign();
    }
  });

  const isLoggedIn = Boolean(currentUser);

  const isCampaignEnabled =
    campaign &&
    !(
      service &&
      campaign.target &&
      campaign.target !== CAMPAIGN_TARGETS.OVERALL &&
      campaign.target !== service
    );

  const getHref = () => {
    if (!isCampaignEnabled) {
      return href;
    }

    if (
      service === BRANDS.NUTRITION ||
      campaign.target === CAMPAIGN_TARGETS.NUTRITION
    ) {
      const checkoutHref = checkoutUrl({
        showHero: true,
        service: BRANDS.NUTRITION
      });
      return isLoggedIn
        ? checkoutHref
        : states.auth.registration({ returnTo: checkoutHref });
    }

    const buyingPageUrl = states.buyCoachTrainingCampaign({
      cid: "ttn-s-30",
      gender: (isLoggedIn && { m: "1", f: "2" }[currentUser.gender]) || "1",
      voucher: campaign.voucherToken
    });

    return states.athleteAssessment({
      returnTo: isLoggedIn
        ? buyingPageUrl
        : states.auth.registration({ returnTo: buyingPageUrl })
    });
  };

  const buttonHref = getHref();

  return (
    <Button {...props} href={buttonHref}>
      {typeof children === "function"
        ? children(isCampaignEnabled ? campaign : null)
        : children}
    </Button>
  );
};

CampaignButton.defaultProps = {
  service: null,
  campaign: null,
  currentUser: null
};

CampaignButton.propTypes = {
  actions: PropTypes.shape({
    fetchCampaign: PropTypes.func.isRequired
  }).isRequired,
  service: PropTypes.string,
  /* eslint-disable react/forbid-prop-types */
  campaign: PropTypes.object,
  currentUser: PropTypes.object,
  /* eslint-enable react/forbid-prop-types */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  href: PropTypes.string.isRequired
};

export { mapStateToProps, mapDispatchToProps };
export default CampaignButton;
