import React from "react";
import PropTypes from "prop-types";
import Observer from "@researchgate/react-intersection-observer";
import classnames from "classnames";

import Image from "../Image";

/*const generateBlurredUrl = url => {
  const [src, query] = url.split("?");
  const params = new URLSearchParams(query);

  params.set("w", 50);
  params.set("q", 20);
  params.set("blur", 25);
  params.set("fit", "crop");

  return `${src}?${params.toString()}`;
  //return '../../assets/media/blur.png';
};*/

class LazyImage extends React.Component {
  state = { isLoaded: false, isVisible: false };

  handleImageOnLoad = () => {
    this.setState(() => ({ isLoaded: true }));
  };

  handleIntersection = event => {
    // MSEdge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
    if (event.isIntersecting || event.intersectionRatio > 0) {
      this.setState(() => ({ isVisible: true }));
    }
  };

  render() {
    const { alt, className, src, width, ...rest } = this.props;
    const { isLoaded, isVisible } = this.state;
    const blurredSrc = require("../../assets/media/blur.png"); //generateBlurredUrl(src);

    if (process.env.NODE_ENV === "development") {
      if (src.split("?")[0].endsWith(".svg")) {
        throw new Error(
          `<LazyImage> should not be used to load SVG files: ${src}`
        );
      }
    }

    return (
      <Observer disabled={isVisible} onChange={this.handleIntersection}>
        <div
          className={classnames(className, "imageContainer", {
            isLoaded: isLoaded
          })}
        >
          {isVisible && (
            <Image
              src={src}
              alt={alt}
              width={width}
              className={"originalImage"}
              onLoad={this.handleImageOnLoad}
              {...rest}
            />
          )}
          <img
            src={blurredSrc}
            alt={alt}
            {...rest}
            className={"blurredImage"}
          />
        </div>
      </Observer>
    );
  }
}

LazyImage.defaultProps = {
  className: null
};

LazyImage.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
};

export default LazyImage;
