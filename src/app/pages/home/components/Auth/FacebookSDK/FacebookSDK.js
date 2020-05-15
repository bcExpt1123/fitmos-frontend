import React from "react";
import PropTypes from "prop-types";

import decodeParamForKey from "./decodeParam";

const { REACT_APP_FB_APP_ID } = process.env;

const isRedirectedFromFb = () => {
  const params = window.location.search;
  return (
    decodeParamForKey(params, "code") ||
    decodeParamForKey(params, "granted_scopes")
  );
};

class FacebookSDK extends React.Component {
  static propTypes = {
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    // TODO: implement this
    // disableMobileRedirect: PropTypes.bool,
    version: PropTypes.string,
    language: PropTypes.string
  };

  static defaultProps = {
    xfbml: false,
    cookie: false,
    version: "3.2",
    language: "en_US"
    // disableMobileRedirect: false,
  };

  state = {
    isSdkLoaded: false
  };

  componentDidMount() {
    if (document.getElementById("facebook-jssdk")) {
      this.sdkLoaded();
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
    let fbRoot = document.getElementById("fb-root");
    if (!fbRoot) {
      fbRoot = document.createElement("div");
      fbRoot.id = "fb-root";
      document.body.appendChild(fbRoot);
    }
  }

  setFbAsyncInit() {
    const { xfbml, cookie, version } = this.props;
    window.fbAsyncInit = () => {
      // TODO: Throw error on init failure
      window.FB.init({
        version: `v${version}`,
        appId: REACT_APP_FB_APP_ID,
        xfbml,
        cookie,
        status: true
      });
      this.sdkLoaded();
      // Detects when users is redirected to page in case of mobile login
      // TODO: Handle this with Redux actions
      if (isRedirectedFromFb()) {
        // getFacebookLoginStatus();
      }
    };
  }

  sdkLoaded() {
    this.setState({ isSdkLoaded: true });
  }

  loadSdkAsynchronously() {
    const { language } = this.props;
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${language}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  render() {
    const { isSdkLoaded } = this.state;

    return this.props.children(isSdkLoaded);
  }
}

export default FacebookSDK;
