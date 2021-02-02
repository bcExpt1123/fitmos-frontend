import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { ErrorMessage } from "formik";

import { FormattedMessage } from "react-intl";

const FormGroup = ({
  children,
  focused,
  hasValue,
  htmlFor,
  label,
  name,
  touched,
  display,
  valid,
  skipErrorMessage
}) => {
  const classes = classnames("form-group", {
    focused: focused,
    hasValue: hasValue,
    valid: valid,
    invalid: !valid,
    touched: touched,
    'd-none':display,
  });

  return (
    <div className={classes}>
      <label htmlFor={htmlFor || name} className={"form-label"}>
        {label}
      </label>
      <div className={"form-control"}>{children}</div>
      {!skipErrorMessage && (
        <ErrorMessage
          name={name}
          render={message => (
            <div className={"form-group-errors"}>
              {message.id ? <FormattedMessage {...message} /> : message}
            </div>
          )}
        />
      )}
    </div>
  );
};

FormGroup.defaultProps = {
  focused: false,
  hasValue: false,
  touched: false,
  valid: null,
  skipErrorMessage: false
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  focused: PropTypes.bool,
  hasValue: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  name: PropTypes.string.isRequired,
  touched: PropTypes.bool,
  valid: PropTypes.bool,
  skipErrorMessage: PropTypes.bool
};

export default FormGroup;
