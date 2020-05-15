import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Link from "../Link";
import Icon from "../Icon";

//import styles from './Button.module.css';
const styles = {
  lg: "lg",
  md: "md",
  sm: "sm",
  xs: "xs",
  facebook: "facebook",
  google: "google"
};
const Button = ({
  block,
  children,
  className,
  disabled,
  href,
  shadow,
  size,
  target,
  theme,
  type,
  ...other
}) => {
  const classes = classnames(className, {
    block: block,
    button: true,
    shadow: shadow,
    [styles[size]]: size,
    [styles[theme]]: theme
  });

  const attrs = {
    className: classes,
    disabled,
    ...other
  };

  const link = (
    <Link href={href} target={target} role="button" {...attrs}>
      {children}
    </Link>
  );

  const button = (
    // eslint-disable-next-line react/button-has-type
    <button type={type} {...attrs}>
      {(theme === "facebook" || theme === "google") && <Icon name={theme} />}
      {children}
    </button>
  );

  return href ? link : button;
};

Button.displayName = "Button";

Button.defaultProps = {
  block: false,
  disabled: false,
  shadow: false,
  size: "md",
  theme: "training",
  type: "button"
};

Button.propTypes = {
  block: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  shadow: PropTypes.bool,
  size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
  target: PropTypes.oneOfType([
    PropTypes.oneOf(["_blank", "_self"]),
    PropTypes.string
  ]),
  theme: PropTypes.oneOf([
    "training",
    "training-inverted",
    "nutrition",
    "nutrition-inverted",
    "dark",
    "dark-inverted",
    "ghost",
    "ghost-inverted",
    "grey",
    "facebook",
    "google"
  ]),
  type: PropTypes.oneOf(["button", "submit", "reset"])
};

export default Button;
