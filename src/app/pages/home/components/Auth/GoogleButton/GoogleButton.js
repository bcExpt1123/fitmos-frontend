import React from "react";
import PropTypes from "prop-types";
import Button from "../../Button";
import GoogleSDK from "../GoogleSDK";

const GoogleButton = ({ children, disabled, onClick, ...rest }) => {
  return (
    <GoogleSDK>
      {loaded => (
        <Button
          theme="google"
          block
          disabled={!loaded || disabled}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Button>
      )}
    </GoogleSDK>
  );
};

GoogleButton.defaultProps = {
  disabled: false
};

GoogleButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default GoogleButton;
