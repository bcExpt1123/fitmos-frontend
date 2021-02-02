import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const styles = {};

const Spinner = ({ absoluteCenter, className, color, size }) => {
  const classes = classnames(styles.spinner, className, {
    [styles.absoluteCenter]: absoluteCenter,
    [styles[color]]: color !== "inherit",
    [styles[size]]: size !== "inherit"
  });

  const blades = [];
  for (let i = 0; i < 12; i += 1) {
    blades.push(<div key={i} />);
  }

  return <div className={classes}>{blades}</div>;
};

Spinner.defaultProps = {
  absoluteCenter: false,
  className: null,
  color: "light",
  size: "md"
};

Spinner.propTypes = {
  absoluteCenter: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.oneOf(["inherit", "light", "grey", "dark"]),
  size: PropTypes.oneOf(["inherit", "lg", "md", "sm", "xs"])
};

export default Spinner;
