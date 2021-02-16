import React from "react";
import PropTypes from "prop-types";
import AppleSignin from 'react-apple-signin-auth';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/utils/utils";

const AppleButton = ({ children, disabled, onSuccess,onError, ...rest }) => {
  return (
    <AppleSignin
    /** Auth options passed to AppleID.auth.init() */
    authOptions={{
      /** Client ID - eg: 'com.example.com' */
      clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
      /** Requested scopes, seperated by spaces - eg: 'email name' */
      scope: 'email name',
      /** Apple's redirectURI - must be one of the URIs you added to the serviceID - the undocumented trick in apple docs is that you should call auth from a page that is listed as a redirectURI, localhost fails */
      redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URL,
      /** State string that is returned with the apple response */
      state: 'state',
      /** Nonce */
      nonce: 'nonce',
      /** Uses popup auth instead of redirection */
      usePopup: true,
    }} // REQUIRED
    /** General props */
    uiType="dark"
    /** Extra controlling props */
    /** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
    onSuccess={onSuccess} // default = undefined    
    /** Called upon signin error */
    onError={onError} // default = undefined
    /** Skips loading the apple script if true */
    skipScript={false} // default = undefined
    /** Apple image props */
    // iconProp={{ style: { marginTop: '10px' } }} // default = undefined
    /** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
    render={(props) => <button
      type="button"
      className="block button md apple"
      disabled={false || disabled}
      onClick={props.onClick}
      {...rest}
    >
      <SVG src={toAbsoluteUrl("/media/icons/svg/Social/apple.svg")} />
      {children}
    </button>}
  />
  );
};

AppleButton.defaultProps = {
  disabled: false
};

AppleButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default AppleButton;
