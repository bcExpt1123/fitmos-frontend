import React from "react";
import { Link as NavLink } from "react-navi";
import classnames from "classnames";
import omit from "lodash/omit";

const omitNavLinkProps = props =>
  omit(props, [
    "active",
    "activeClassName",
    "activeStyle",
    "children",
    "className",
    "disabled",
    "exact",
    "hidden",
    "href",
    "id",
    "lang",
    "ref",
    "rel",
    "style",
    "tabIndex",
    "target",
    "title",
    "precache",
    "onClick"
  ]);

const Link = props => {
  // Discard all properties handled by NavLink internally
  const anchorProps = omitNavLinkProps(props);

  return (
    <NavLink
      {...props}
      prefetch={false}
      render={({
        active,
        activeClassName,
        activeStyle,
        children,
        className,
        hidden,
        style
      }) => (
        <NavLink.Anchor
          className={classnames(className, {
            [activeClassName]: activeClassName ? active : null
          })}
          hidden={hidden}
          style={{ ...style, ...(active ? activeStyle : {}) }}
          {...anchorProps}
        >
          {children}
        </NavLink.Anchor>
      )}
    >
      {props.children}
    </NavLink>
  );
};

export default Link;
