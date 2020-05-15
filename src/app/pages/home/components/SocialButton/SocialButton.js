import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Icon from "../Icon";
import Spinner from "../Spinner";

import { AUTH_PROVIDER } from "../../constants/auth-provider";

const styles = {};

const SocialIcon = ({ provider }) => {
  switch (provider) {
    case AUTH_PROVIDER.FACEBOOK:
      return <Icon name="facebook" display="block" />;
    case AUTH_PROVIDER.GOOGLE:
      return <Icon name="google" display="block" />;
    default:
      return null;
  }
};

const IconContainer = ({ isProcessing, provider }) => {
  return (
    <span className={styles.iconConatiner}>
      {isProcessing ? (
        <Spinner color="dark" size="xs" display="block" />
      ) : (
        <SocialIcon provider={provider} />
      )}
    </span>
  );
};

const SocialButton = ({
  block,
  children,
  className,
  disabled,
  isProcessing,
  onClick,
  provider,
  theme,
  ...other
}) => {
  const classes = classnames(className, {
    [styles.block]: block,
    [styles.button]: true,
    [styles.isProcessing]: isProcessing,
    [styles[theme]]: theme !== "dark"
  });

  const attrs = {
    className: classes,
    disabled,
    onClick,
    ...other
  };

  return (
    <button type="button" {...attrs}>
      {provider && (
        <IconContainer provider={provider} isProcessing={isProcessing} />
      )}
      <span className={styles.textContainer}>{children}</span>
    </button>
  );
};

SocialButton.defaultProps = {
  block: false,
  className: null,
  disabled: false,
  isProcessing: false,
  theme: "dark"
};

SocialButton.propTypes = {
  block: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isProcessing: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  provider: PropTypes.oneOf([
    AUTH_PROVIDER.APPLE,
    AUTH_PROVIDER.FACEBOOK,
    AUTH_PROVIDER.GOOGLE
  ]).isRequired,
  theme: PropTypes.oneOf(["dark", "light"])
};

export default SocialButton;
