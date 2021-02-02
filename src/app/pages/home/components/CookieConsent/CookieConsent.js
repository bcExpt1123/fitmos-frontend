import React from "react";
import { Helmet } from "react-helmet";
import { FormattedHTMLMessage } from "react-intl";
import classnames from "classnames";

import { grantMarketingConsent } from "../../redux/marketingConsent/actions";

import Icon from "../Icon";

//import styles from './CookieConsent.module.css';
const styles = {};
const SCROLL_THRESHOLD = 48;
const CONSENT_TIMEOUT = 20000;

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser,
  marketingConsent: state.marketingConsent
});
const mapDispatchToProps = { grantMarketingConsent };

class CookieConsent extends React.Component {
  state = {
    prevScrollPosition: 0
  };

  componentDidMount() {
    this.setState({
      prevScrollPosition: window.pageYOffset
    });
    window.addEventListener("scroll", this.handleScroll);
    setTimeout(() => this.handleClick(), CONSENT_TIMEOUT);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { prevScrollPosition } = this.state;
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > prevScrollPosition + SCROLL_THRESHOLD) {
      this.grantConsentAndUnbind();
    }
  };

  handleClick = () => {
    this.grantConsentAndUnbind();
  };

  grantConsentAndUnbind() {
    if (
      !this.props.currentUser &&
      this.props.marketingConsent.marketingConsent === null
    ) {
      this.props.grantMarketingConsent();
    }
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { currentUser, marketingConsent } = this.props;
    const isVisible =
      marketingConsent.marketingConsent === null && !currentUser;

    const cookiePopup = (
      <div
        className={classnames(styles.cookieConsent, {
          [styles.isVisible]: isVisible
        })}
        style={{ display: "none" }}
      >
        <p>
          <FormattedHTMLMessage
            id="CookieConsent.Text.Consent"
            values={{ privacyUrl: false }}
          />
        </p>

        <button type="button" onClick={this.handleClick}>
          <Icon name="close" />
        </button>
      </div>
    );

    return (
      <>
        {marketingConsent.marketingConsent && (
          <Helmet>
            <script>
              {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer', '${process.env.GOOGLE_TAG_MANAGER_ID_MARKETING}');
            `}
            </script>
          </Helmet>
        )}

        {cookiePopup}
      </>
    );
  }
}

export { mapStateToProps, mapDispatchToProps };
export default CookieConsent;
