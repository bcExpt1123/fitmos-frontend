import React from "react";

const ProgressBar = props => {
  const { currentStep, stepCount } = props;
  const style = {
    width: `${(100 / (stepCount - 1)) * currentStep}%`
  };

  const progressbar = (
    <div className={"progress-bar"}>
      <div style={style} />
    </div>
  );

  return progressbar;
};

export default ProgressBar;
