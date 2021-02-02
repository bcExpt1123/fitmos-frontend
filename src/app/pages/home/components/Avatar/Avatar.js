import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

//import { imgixUrl } from '../../lib/imgixUrl';

//import styles from './Avatar.module.css';
const styles = {
  xl: "xl",
  lg: "lg",
  md: "md",
  xm: "xm",
  xs: "xs"
};
const pictureSrc = ({ pictureUrls, size }) => {
  switch (size) {
    case "xl":
    case "lg":
      return pictureUrls.large;
    case "md":
      return pictureUrls.medium;
    default:
      return pictureUrls.small;
  }
};

const Avatar = ({ children, className, pictureUrls, size, changeImage }) => {
  const classes = classnames(className, {
    avatar: true,
    [styles[size]]: size
  });
  let src = pictureSrc({
    pictureUrls,
    size
  });
  if (changeImage) src = changeImage;
  return (
    <div className={classes}>
      <div className={"avatar-clip"}>
        {children}
        <img src={src} alt="avatar" />
      </div>
    </div>
  );
};

Avatar.defaultProps = {
  className: null,
  size: "md"
};

Avatar.propTypes = {
  className: PropTypes.string,
  pictureUrls: PropTypes.PropTypes.shape({
    large: PropTypes.string,
    medium: PropTypes.string,
    small: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(["xl", "lg", "md", "sm", "xs","xm"])
};

export default Avatar;
