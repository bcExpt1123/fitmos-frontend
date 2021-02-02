import React from "react";
import PropTypes from "prop-types";

function generateSrcSet({ src, width, minWidth = 200, stepCount = 4 }) {
  const stepSize = Math.round((width - minWidth) / stepCount);
  const steps = Array.from({ length: stepCount + 1 }).map(
    (_, index) => minWidth + stepSize * index
  );

  return steps.map(s => `${src}&w=${s} ${s}w`).join(",");
}

class Image extends React.Component {
  state = { elementWidth: 0 };

  ref = React.createRef();

  componentDidMount() {
    this.setState(() => ({ elementWidth: this.ref.current.offsetWidth }));
  }

  render() {
    const { alt, className, src, width, ...rest } = this.props;
    const { elementWidth } = this.state;

    return (
      <div className={className}>
        <div ref={this.ref} />
        <img
          src={src}
          alt={alt}
          style={{ display: "block", width: "100%" }}
          sizes={`${elementWidth || width}px`}
          srcSet={generateSrcSet({ src, width })}
          {...rest}
        />
      </div>
    );
  }
}

Image.defaultProps = {
  className: null
};

Image.propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
};

export default Image;
