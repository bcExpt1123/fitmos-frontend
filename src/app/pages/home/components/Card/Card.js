import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const Card = ({ children, className, noMarginBottom, padding }) => {
  const classes = classnames(className, {
    card: true,
    "no-margin-bottom": noMarginBottom,
    [`${padding}-padding`]: padding !== "none"
  });

  return <div className={classes}>{children}</div>;
};

Card.defaultProps = {
  className: null,
  noMarginBottom: false,
  padding: "md"
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  noMarginBottom: PropTypes.bool,
  padding: PropTypes.oneOf(["lg", "md", "sm", "xs", "none"])
};

export default Card;
