import React from "react";
import PropTypes from "prop-types";

function Step(props) {
  const { children, stepCount } = props;

  return (
    <React.Fragment>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child, {
          stepCount,
          ...child.props
        });
      })}
    </React.Fragment>
  );
}

Step.propTypes = {
  children: PropTypes.node.isRequired
};

export default Step;
