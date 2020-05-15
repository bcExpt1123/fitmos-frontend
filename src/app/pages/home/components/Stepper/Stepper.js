import React from "react";
import PropTypes from "prop-types";

function Stepper(props) {
  const { activeStep, children } = props;

  const childrenArray = React.Children.toArray(children);

  // Add index prop to Step elements
  const steps = childrenArray.map((step, index) =>
    React.cloneElement(step, {
      index,
      stepCount: childrenArray.length,
      ...step.props
    })
  );

  return steps[activeStep];
}

Stepper.propTypes = {
  activeStep: PropTypes.number,
  children: PropTypes.node.isRequired
};

Stepper.defaultProps = {
  activeStep: 0
};

export default Stepper;
