import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const styles = {};

const Tooltip = ({ children, className, boxClassName, content, placement }) => {
  const [side, position] = placement.split("-");

  return (
    <div className={classnames(styles.tooltip, className)}>
      {children}
      <div
        className={classnames(
          boxClassName,
          styles.tooltipBox,
          styles[side],
          styles[position]
        )}
      >
        {content}
      </div>
    </div>
  );
};

Tooltip.defaultProps = {
  className: null,
  boxClassName: null,
  placement: "bottom"
};

Tooltip.propTypes = {
  className: PropTypes.string,
  boxClassName: PropTypes.string,
  content: PropTypes.node.isRequired,
  placement: PropTypes.oneOf([
    "bottom-end",
    "bottom-start",
    "bottom",
    "left-end",
    "left-start",
    "left",
    "right-end",
    "right-start",
    "right",
    "top-end",
    "top-start",
    "top"
  ])
};

export default Tooltip;
