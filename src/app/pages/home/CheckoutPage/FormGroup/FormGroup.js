import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const FormGroup = ({
  children,
  className,
  focused,
  hasValue,
  id,
  label,
  touched,
  valid
}) => {
  const classes = classnames("form-control", {
    focused: focused,
    hasValue: hasValue,
    valid: valid,
    invalid: !valid,
    touched: touched
  });
  const classGroupes = classnames("form-group", {
    focused: focused,
    hasValue: hasValue,
    valid: valid,
    invalid: !valid,
    touched: touched
  });

  return (
    <div className={classnames(classGroupes, className)}>
      <label htmlFor={id} className={"form-label"}>
        {label}
      </label>
      <div className={classes}>{children}</div>
    </div>
  );
};

FormGroup.defaultProps = {
  focused: false,
  hasValue: false,
  touched: false,
  valid: null
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  focused: PropTypes.bool,
  hasValue: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  id: PropTypes.string.isRequired,
  touched: PropTypes.bool,
  valid: PropTypes.bool
};

export default FormGroup;
