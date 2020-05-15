import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const Typography = ({
  align,
  children,
  className,
  color,
  noWrap,
  noMarginBottom,
  size,
  tagName,
  tagNameMapping,
  uppercase,
  variant,
  ...other
}) => {
  const classes = classnames(className, {});

  const Component = tagName || tagNameMapping[variant];

  return (
    <Component className={classes} {...other}>
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";

Typography.defaultProps = {
  align: "inherit",
  className: null,
  color: "inherit",
  noWrap: false,
  noMarginBottom: false,
  size: "md",
  tagName: null,
  variant: "body",
  tagNameMapping: {
    flHeading: "h1",
    heading: "h1",
    subheading: "h2",
    captionheading: "h4",
    body: "p",
    inline: "span"
  },
  uppercase: null
};

Typography.propTypes = {
  align: PropTypes.oneOf(["inherit", "left", "center", "right"]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "inherit",
    "light",
    "dark",
    "grey",
    "lightGrey",
    "darkGrey"
  ]),
  noWrap: PropTypes.bool,
  noMarginBottom: PropTypes.bool,
  size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
  tagName: PropTypes.oneOfType([
    PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"]),
    PropTypes.any
  ]),
  // eslint-disable-next-line react/forbid-prop-types
  tagNameMapping: PropTypes.object,
  uppercase: PropTypes.bool,
  variant: PropTypes.oneOf([
    "flHeading",
    "heading",
    "subheading",
    "captionheading",
    "body",
    "inline"
  ])
};

export default Typography;
