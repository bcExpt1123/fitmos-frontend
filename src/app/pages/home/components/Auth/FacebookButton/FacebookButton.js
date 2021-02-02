import React from "react";
import PropTypes from "prop-types";
import Button from "../../Button";
import FacebookSDK from "../FacebookSDK";

const FacebookButton = ({ children, disabled, onClick, ...rest }) => {
  return (
    <FacebookSDK>
      {loaded => (
        <Button
          theme="facebook"
          block
          disabled={!loaded || disabled}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Button>
      )}
    </FacebookSDK>
  );
};

FacebookButton.defaultProps = {
  disabled: false
};

FacebookButton.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

export default FacebookButton;
